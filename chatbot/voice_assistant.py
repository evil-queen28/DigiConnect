import speech_recognition as sr
from gtts import gTTS
import io
from pydub import AudioSegment
from pydub.playback import play
import tempfile
import os
from langdetect import detect

class VoiceAssistant:
    def __init__(self, chatbot):
        self.chatbot = chatbot
        self.recognizer = sr.Recognizer()
        self.language_codes = {
            'en': 'en-IN',
            'hi': 'hi-IN',
            'bn': 'bn-IN',
            'te': 'te-IN',
            'ta': 'ta-IN',
            'mr': 'mr-IN',
            'gu': 'gu-IN',
            'kn': 'kn-IN',
            'ml': 'ml-IN',
            'pa': 'pa-IN',
            'or': 'or-IN',
            'ne': 'ne-IN',
            'sd': 'sd-IN',
            'ur': 'ur-IN'
        }

    def listen(self):
        with sr.Microphone() as source:
            print("Adjusting for ambient noise. Please wait...")
            self.recognizer.adjust_for_ambient_noise(source, duration=1)
            print("Listening...")
            audio = self.recognizer.listen(source, timeout=10, phrase_time_limit=10)
        
        return audio

    def recognize_speech(self, audio):
        try:
            # Try to recognize speech in all supported languages
            for lang_code in self.language_codes.values():
                try:
                    text = self.recognizer.recognize_google(audio, language=lang_code)
                    detected_lang = detect(text)
                    print(f"Recognized: {text}")
                    print(f"Detected language: {detected_lang}")
                    return text, detected_lang
                except sr.UnknownValueError:
                    continue
            
            print("Could not understand audio in any supported language")
            return None, None
        except sr.RequestError as e:
            print(f"Could not request results; {e}")
            return None, None
        except Exception as e:
            print(f"An error occurred: {e}")
            return None, None

    def text_to_speech(self, text, language):
        tts = gTTS(text=text, lang=language)
        fp = io.BytesIO()
        tts.write_to_fp(fp)
        fp.seek(0)
        return fp.getvalue()

    def process_voice_input(self):
        audio = self.listen()
        user_input, detected_lang = self.recognize_speech(audio)
        
        if user_input and detected_lang:
            # Set the language based on detected language
            self.chatbot.set_language(detected_lang)
            # Get response from the chatbot
            response = self.chatbot.get_response(user_input)

            return {
                "recognized_text": user_input,
                "detected_language": detected_lang,
                "response": response
            }
        return None

