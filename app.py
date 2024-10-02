from flask import Flask, jsonify, request, send_file, send_from_directory, render_template, session
from flask import Flask, jsonify, request, render_template, session, redirect, url_for
from dotenv import load_dotenv
from chatbot.government_chatbot import GovernmentChatbot
from chatbot.voice_assistant import VoiceAssistant
import os
import logging
import io
import random
import string
import requests
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from PIL import Image, ImageDraw, ImageFont
import base64
import re
from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash
from bson.json_util import dumps
from bson.json_util import dumps, loads
from bson.objectid import ObjectId
from werkzeug.utils import secure_filename
load_dotenv()


app = Flask(__name__)
from urllib.parse import quote_plus

# ... (other imports)

load_dotenv()

username = os.getenv('MONGO_USERNAME')
password = os.getenv('MONGO_PASSWORD')
cluster = os.getenv('MONGO_CLUSTER')


mongo_uri = f"mongodb+srv://{quote_plus(username)}:{quote_plus(password)}@{cluster}"
client = MongoClient(mongo_uri)

db = client.get_database('dpi_users')
users_collection = db.users
points_collection = db.points
quests_collection = db.quests
# Add these lines after creating the Flask app
app.config['RECAPTCHA_SITE_KEY'] = os.getenv('RECAPTCHA_SITE_KEY')
app.config['RECAPTCHA_SECRET_KEY'] = os.getenv('RECAPTCHA_SECRET_KEY')
app.secret_key = os.getenv('SECRET_KEY')
app.config['SENDGRID_API_KEY'] = os.getenv('SENDGRID_API_KEY')
app.config['SENDGRID_FROM_EMAIL'] = os.getenv('SENDGRID_FROM_EMAIL')
app.config['UPLOAD_FOLDER'] = 'static/images/profile_pictures'


logging.basicConfig(level=logging.DEBUG)





def generate_otp():
    return ''.join(random.choices(string.digits, k=6))


def send_email_otp(email, otp):
    message = Mail(
        from_email=app.config['SENDGRID_FROM_EMAIL'],
        to_emails=email,
        subject='Your OTP for DPI signup',
        html_content=f'Your OTP for DPI signup is: <strong>{otp}</strong>')
    try:
        sg = SendGridAPIClient(app.config['SENDGRID_API_KEY'])
        response = sg.send(message)
        logging.debug(f"SendGrid API response status code: {response.status_code}")
        logging.debug(f"SendGrid API response body: {response.body}")
        logging.debug(f"SendGrid API response headers: {response.headers}")
        return response.status_code == 202
    except Exception as e:
        logging.error(f"Failed to send email: {str(e)}")
        return False




try:
    chatbot = GovernmentChatbot()
    voice_assistant = VoiceAssistant(chatbot)
except Exception as e:
    logging.error(f"Failed to initialize chatbot or voice assistant: {e}")
    chatbot = None
    voice_assistant = None

# Main routes
@app.route("/")
def index():
    if 'user' in session:
        user = loads(session['user'])
        profile_picture = user.get('profile_picture', 'default.jpg')
        profile_picture_url = url_for('static', filename=f'images/profile_pictures/{profile_picture}')
        return render_template('main_page.html', user=user, profile_picture_url=profile_picture_url)
    return render_template('main_page.html')

@app.route("/chatbot")
def chatbot_page():
    return render_template('chatbot.html')

@app.route("/dashboard")
def dashboard_page():
    if 'user' in session:
        user = loads(session['user'])
        profile_picture = user.get('profile_picture', 'default.jpg')
        profile_picture_url = url_for('static', filename=f'images/profile_pictures/{profile_picture}')
        return render_template('dashboard.html', user=user, profile_picture_url=profile_picture_url)
    
    return render_template('dashboard.html')

@app.route("/voice-assistant")
def voice_assistant_page():
    return render_template('voice_assistant.html')

# API routes
@app.route("/api/chat", methods=["POST"])
def chat():
    if chatbot is None:
        return jsonify({"error": "Chatbot is not initialized"}), 500
    
    try:
        user_input = request.json.get("message")
        if not user_input:
            return jsonify({"error": "No message provided"}), 400
        
        response_text = chatbot.get_response(user_input)
        return jsonify({"response": response_text})
    except Exception as e:
        logging.error(f"Error in /api/chat: {e}", exc_info=True)
        return jsonify({"error": "An error occurred while processing your request. Please try again."}), 500

@app.route('/api/greeting', methods=["GET"])
def greeting():
    if chatbot is None:
        return jsonify({"error": "Chatbot is not initialized"}), 500
    return jsonify({"greeting": chatbot.get_greeting()})

@app.route('/api/set_language', methods=["POST"])
def set_language():
    if chatbot is None:
        return jsonify({"error": "Chatbot is not initialized"}), 500
    
    language_code = request.json.get("language")
    if not language_code:
        return jsonify({"error": "No language code provided"}), 400
    
    chatbot.set_language(language_code)
    return jsonify({"success": True, "message": "Language set successfully"})

@app.route('/api/languages', methods=["GET"])
def get_languages():
    languages = [
        {"code": "en", "name": "English"},
        {"code": "hi", "name": "Hindi"},
        {"code": "bn", "name": "Bengali"},
        {"code": "te", "name": "Telugu"},
        {"code": "ta", "name": "Tamil"},
        {"code": "mr", "name": "Marathi"},
        {"code": "gu", "name": "Gujarati"},
        {"code": "kn", "name": "Kannada"},
        {"code": "ml", "name": "Malayalam"},
        {"code": "pa", "name": "Punjabi"},
        {"code": "or", "name": "Odia"},
        {"code": "ne", "name": "Nepali"},
        {"code": "sd", "name": "Sindhi"},
        {"code": "ur", "name": "Urdu"}
    ]
    return jsonify(languages)

@app.route('/api/voice_input', methods=['POST'])
def voice_input():
    if voice_assistant is None:
        return jsonify({"error": "Voice assistant is not initialized"}), 500
    
    try:
        response = voice_assistant.process_voice_input()
        if response is None:
            return jsonify({"error": "No speech detected or audio input failed. Please check your microphone and try again."}), 400
        return jsonify(response)
    except Exception as e:
        logging.error(f"Error in /api/voice_input: {e}", exc_info=True)
        return jsonify({"error": "An error occurred while processing your voice input. Please try again or use text input instead."}), 500

@app.route('/api/text_to_speech', methods=['POST'])
def text_to_speech():
    if voice_assistant is None:
        return jsonify({"error": "Voice assistant is not initialized"}), 500
    
    try:
        text = request.json.get("text")
        language = request.json.get("language", chatbot.current_language)
        if not text:
            return jsonify({"error": "No text provided"}), 400
        
        audio_data = voice_assistant.text_to_speech(text, language)
        return send_file(
            io.BytesIO(audio_data),
            mimetype="audio/mp3",
            as_attachment=True,
            download_name="response.mp3"
        )
    except Exception as e:
        logging.error(f"Error in /api/text_to_speech: {e}", exc_info=True)
        return jsonify({"error": "An error occurred while converting text to speech. Please try again."}), 500

def generate_captcha_string(length=6):
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=length))

def generate_captcha_image(text, width=200, height=70):
    image = Image.new('RGB', (width, height), color=(240, 240, 240))
    draw = ImageDraw.Draw(image)
    
    try:
        # Try to use a system font
        font = ImageFont.truetype("arial.ttf", 36)
    except IOError:
        # If the system font is not available, use the default font
        font = ImageFont.load_default()

    # Add some noise
    for _ in range(5):
        draw.line([(random.randint(0, width), random.randint(0, height)), 
                   (random.randint(0, width), random.randint(0, height))], 
                  fill=(random.randint(0, 200), random.randint(0, 200), random.randint(0, 200)), 
                  width=2)
    
    # Draw text
    text_bbox = draw.textbbox((0, 0), text, font=font)
    text_width = text_bbox[2] - text_bbox[0]
    text_height = text_bbox[3] - text_bbox[1]
    position = ((width - text_width) / 2, (height - text_height) / 2)
    draw.text(position, text, font=font, fill=(0, 0, 128))
    
    buffered = io.BytesIO()
    image.save(buffered, format="PNG")
    return base64.b64encode(buffered.getvalue()).decode()

@app.route('/get_captcha')
def get_captcha():
    captcha_text = generate_captcha_string()
    try:
        captcha_image = generate_captcha_image(captcha_text)
        session['captcha'] = captcha_text
        return jsonify({'captcha_image': f'data:image/png;base64,{captcha_image}'})
    except Exception as e:
        app.logger.error(f"Error generating CAPTCHA: {str(e)}")
        return jsonify({'error': 'Failed to generate CAPTCHA'}), 500



    
def verify_recaptcha(recaptcha_response):
    verify_url = 'https://www.google.com/recaptcha/api/siteverify'
    data = {
        'secret': app.config['RECAPTCHA_SECRET_KEY'],
        'response': recaptcha_response
    }
    response = requests.post(verify_url, data=data)
    result = response.json()
    return result.get('success', False)

@app.route('/signup')
def signup():
    app.logger.debug(f"RECAPTCHA_SITE_KEY: {app.config['RECAPTCHA_SITE_KEY']}")
    return render_template('signup.html', recaptcha_site_key=app.config['RECAPTCHA_SITE_KEY'])


@app.route('/reset_password')
def reset_password():
    return render_template('reset_password.html', recaptcha_site_key=app.config['RECAPTCHA_SITE_KEY'])

def verify_captcha(user_input):
    return user_input.upper() == session.get('captcha')

@app.route('/verify_captcha', methods=['POST'])
def verify_captcha_route():
    user_input = request.json.get('captcha')
    if verify_captcha(user_input):
        return jsonify({'verified': True})
    else:
        return jsonify({'verified': False})

def send_confirmation_email(email):
    message = Mail(
        from_email=app.config['SENDGRID_FROM_EMAIL'],
        to_emails=email,
        subject='Welcome to DPI - Account Created Successfully',
        html_content='<strong>Your account has been successfully created!</strong>')
    try:
        sg = SendGridAPIClient(app.config['SENDGRID_API_KEY'])
        response = sg.send(message)
        return response.status_code == 202
    except Exception as e:
        app.logger.error(f"Failed to send confirmation email: {str(e)}")
        return False

@app.route('/signup', methods=['POST'])
def signup_post():
    username = request.form.get('username')
    email = request.form.get('email')
    password = request.form.get('password')
    phone_number = request.form.get('phone_number')
    captcha = request.form.get('captcha')
    recaptcha_response = request.form.get('g-recaptcha-response')

    if not verify_captcha(captcha):
        return jsonify({'error': 'Invalid CAPTCHA'}), 400

    if not verify_recaptcha(recaptcha_response):
        return jsonify({'error': 'Invalid reCAPTCHA'}), 400

    # Validate password
    if not re.match(r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$', password):
        return jsonify({'error': 'Password does not meet the requirements'}), 400

    # Check if user already exists
    if users_collection.find_one({'$or': [{'username': username}, {'email': email}]}):
        return jsonify({'error': 'Username or email already exists'}), 400

    # Hash the password
    hashed_password = generate_password_hash(password)

    # Create new user document
    new_user = {
        'username': username,
        'email': email,
        'password': hashed_password,
        'phone_number': phone_number
    }

    # Insert the new user into the database
    users_collection.insert_one(new_user)

    # Send confirmation email
    if send_confirmation_email(email):
        return jsonify({'message': 'Account created successfully'})
    else:
        return jsonify({'error': 'Account created, but failed to send confirmation email'}), 500

# ... (keep other routes and configurations)

@app.route('/signin', methods=['GET'])
def signin_get():
    return render_template('signin.html', recaptcha_site_key=app.config['RECAPTCHA_SITE_KEY'])

@app.route('/signin', methods=['GET', 'POST'])
def signin():
    if request.method == 'POST':
        username = request.form.get('username')
        email = request.form.get('email')
        mobile = request.form.get('mobile')
        password = request.form.get('password')
        recaptcha_response = request.form.get('g-recaptcha-response')

        if not verify_recaptcha(recaptcha_response):
            return jsonify({'error': 'Invalid reCAPTCHA'}), 400

        # Check if the user exists based on username, email, or mobile
        user = users_collection.find_one({
            '$or': [
                {'username': username},
                {'email': email},
                {'phone_number': mobile}
            ]
        })

        if user and check_password_hash(user['password'], password):
            session['user'] = dumps(user)
            return redirect(url_for('index'))
        else:
            return render_template('signin.html', error='Invalid credentials', recaptcha_site_key=app.config['RECAPTCHA_SITE_KEY'])

    return render_template('signin.html', recaptcha_site_key=app.config['RECAPTCHA_SITE_KEY'])


@app.route('/logout')
def logout():
    session.pop('user', None)
    return redirect(url_for('signin'))

@app.route('/reset_password', methods=['POST'])
def reset_password_post():
    email = request.form.get('email')
    captcha = request.form.get('captcha')
    recaptcha_response = request.form.get('g-recaptcha-response')

    if captcha != session.get('captcha'):
        return jsonify({'error': 'Invalid CAPTCHA'}), 400

    if not verify_recaptcha(recaptcha_response):
        return jsonify({'error': 'Invalid reCAPTCHA'}), 400

    # Here you would typically send a password reset email
    # For this example, we'll just return a success message
    return jsonify({'message': 'Password reset email sent'})

@app.route('/send_otp', methods=['POST'])
def send_otp():
    data = request.json
    if not data:
        return jsonify({'error': 'No JSON data received'}), 400

    otp_type = data.get('type')
    value = data.get('value')

    if not otp_type or not value:
        return jsonify({'error': 'Missing type or value'}), 400

    if otp_type not in ['email', 'phone']:
        return jsonify({'error': 'Invalid OTP type'}), 400

    otp = generate_otp()
    
    if otp_type == 'email':
        if send_email_otp(value, otp):
            session[f'{otp_type}_otp'] = otp
            return jsonify({'sent': True, 'message': 'OTP sent successfully'})
        else:
            return jsonify({'error': 'Failed to send OTP'}), 500
    elif otp_type == 'phone':
        # Implement phone OTP sending logic here
        return jsonify({'error': 'Phone OTP not implemented yet'}), 501

@app.route('/verify_otp', methods=['POST'])
def verify_otp():
    data = request.json
    if not data:
        return jsonify({'error': 'No JSON data received'}), 400

    otp_type = data.get('type')
    otp = data.get('otp')

    if not otp_type or not otp:
        return jsonify({'error': 'Missing OTP type or OTP'}), 400

    stored_otp = session.get(f'{otp_type}_otp')
    if otp == stored_otp:
        session.pop(f'{otp_type}_otp', None)  # Clear the OTP after successful verification
        return jsonify({'verified': True})
    else:
        return jsonify({'verified': False})


@app.route("/gamified-learning")
def gamified_learning():
    if 'user' not in session:
        return redirect(url_for('signin'))
    
    user = loads(session['user'])
    profile_picture = user.get('profile_picture', 'default.jpg')
    profile_picture_url = url_for('static', filename=f'images/profile_pictures/{profile_picture}')
    return render_template('gamified_learning.html', user=user, profile_picture_url=profile_picture_url)

@app.route("/api/user_profile")
def get_user_profile():
    if 'user' not in session:
        return jsonify({'error': 'Not authenticated'}), 401
    user = loads(session['user'])
    user_points = get_user_points(user['_id'])
    user_profile = {
        'name': user['username'],
        'level': calculate_level(user_points),
        'points': user_points,
        'completedQuests': get_completed_quests(user['_id']),
        'badges': get_user_badges(user['_id']),
        'rank': calculate_rank(user_points)
    }
    return jsonify(user_profile)

from bson import json_util
from bson.objectid import ObjectId

@app.route("/api/leaderboard")
def get_leaderboard():
    try:
        leaderboard = list(points_collection.find().sort('points', -1).limit(10))
        for entry in leaderboard:
            # Convert ObjectId to string for user_id
            entry['user_id'] = str(entry['user_id'])
            user = users_collection.find_one({'_id': ObjectId(entry['user_id'])})
            entry['username'] = user['username'] if user else 'Unknown'
            # Convert ObjectId to string for _id
            entry['_id'] = str(entry['_id'])
        return json_util.dumps(leaderboard)
    except Exception as e:
        app.logger.error(f"Error in get_leaderboard: {str(e)}")
        return jsonify({'error': 'An error occurred while fetching the leaderboard'}), 500

@app.route("/api/quests")
def get_quests():
    quests = list(quests_collection.find())
    return jsonify(quests)


@app.route("/api/complete_challenge", methods=['POST'])
def complete_challenge():
    if 'user' not in session:
        return jsonify({'error': 'Not authenticated'}), 401
    
    user = loads(session['user'])
    challenge_id = request.json.get('challenge_id')
    points_earned = request.json.get('points_earned')
    
    if not challenge_id or not points_earned:
        return jsonify({'error': 'Invalid challenge data'}), 400
    
    update_user_points(user['_id'], points_earned)
    update_completed_quests(user['_id'], challenge_id)
    new_total_points = get_user_points(user['_id'])
    return jsonify({'success': True, 'points_earned': points_earned, 'total_points': new_total_points})

def get_user_points(user_id):
    points_doc = points_collection.find_one({'user_id': ObjectId(user_id)})
    return points_doc['points'] if points_doc else 0

def update_user_points(user_id, points_to_add):
    points_collection.update_one(
        {'user_id': ObjectId(user_id)},
        {'$inc': {'points': points_to_add}},
        upsert=True
    )

def get_completed_quests(user_id):
    user_doc = users_collection.find_one({'_id': ObjectId(user_id)})
    return user_doc.get('completed_quests', []) if user_doc else []

def update_completed_quests(user_id, quest_id):
    users_collection.update_one(
        {'_id': ObjectId(user_id)},
        {'$addToSet': {'completed_quests': quest_id}}
    )

def get_user_badges(user_id):
    user_doc = users_collection.find_one({'_id': ObjectId(user_id)})
    return user_doc.get('badges', []) if user_doc else []

def calculate_level(points):
    return points // 100 + 1

def calculate_rank(points):
    if points < 500:
        return "Newbie"
    elif points < 1000:
        return "Explorer"
    elif points < 2000:
        return "Adventurer"
    elif points < 5000:
        return "Master"
    else:
        return "Legend"

@app.route("/api/check_auth")
def check_auth():
    if 'user' in session:
        return jsonify({'authenticated': True})
    return jsonify({'authenticated': False})
UPLOAD_FOLDER = 'static/images/profile_pictures'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/profile')
def profile():
    if 'user' not in session:
        return redirect(url_for('signin'))
    user = loads(session['user'])
    profile_picture = user.get('profile_picture', 'default.jpg')
    profile_picture_url = url_for('static', filename=f'images/profile_pictures/{profile_picture}')
    return render_template('profile.html', user=user, profile_picture_url=profile_picture_url)

@app.route('/api/update_profile', methods=['POST'])
def update_profile():
    if 'user' not in session:
        return jsonify({'error': 'Not authenticated'}), 401
    
    user = loads(session['user'])
    user_id = user['_id']

    username = request.form.get('username')
    email = request.form.get('email')
    phone_number = request.form.get('phone_number')

    update_data = {
        'username': username,
        'email': email,
        'phone_number': phone_number
    }

    if 'profile_picture' in request.files:
        file = request.files['profile_picture']
        if file and allowed_file(file.filename):
            filename = secure_filename(f"{user_id}_{file.filename}")
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(file_path)
            update_data['profile_picture'] = filename

    users_collection.update_one({'_id': ObjectId(user_id)}, {'$set': update_data})

    updated_user = users_collection.find_one({'_id': ObjectId(user_id)})
    session['user'] = dumps(updated_user)

    return jsonify({'success': True, 'profile_picture': update_data.get('profile_picture')})
# Static files
@app.route('/static/images/profile_pictures/<path:filename>')
def serve_profile_picture(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)
@app.route('/static/<path:path>')
def serve_static(path):
    return send_from_directory('static', path)

if __name__ == "__main__":
    port = int(os.getenv('PORT', 3000))
    app.run(debug=True, port=port)