# government_chatbot.py
import os
import google.generativeai as genai
from google.generativeai.types import HarmCategory, HarmBlockThreshold
import logging
from googletrans import Translator

logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

class GovernmentChatbot:
    def __init__(self):
        self.api_key = os.getenv('GOOGLE_API_KEY')
        if not self.api_key:
            raise ValueError("Google API key not found in environment variables")

        genai.configure(api_key=self.api_key)
        
        self.generation_config = {
            "temperature": 0.7,
            "top_p": 0.95,
            "top_k": 40,
            "max_output_tokens": 1024,
        }

        self.safety_settings = [
            {
                "category": HarmCategory.HARM_CATEGORY_HARASSMENT,
                "threshold": HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
            },
            {
                "category": HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                "threshold": HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
            },
            {
                "category": HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                "threshold": HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
            },
            {
                "category": HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                "threshold": HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
            },
        ]

        self.initialize_model()
        self.translator = Translator()
        self.current_language = 'en'  # Default language is English

    def initialize_model(self):
        try:
            self.model = genai.GenerativeModel(model_name="gemini-1.0-pro",
                                               generation_config=self.generation_config,
                                               safety_settings=self.safety_settings)
            
            self.chat = self.model.start_chat(history=[])
            self._initialize_context()
            logging.info("Model initialized successfully")
        except Exception as e:
            logging.error(f"Error initializing the model: {e}")
            self.model = None
            self.chat = None

    def _initialize_context(self):
        context = """
        You are an AI assistant specializing in Indian government digital services and Digital Public Infrastructure (DPI).
        Your role is to provide accurate, up-to-date information about services like UPI, Aadhaar, DigiLocker, and other digital government initiatives.
        
        Key points:
        1. **Strictly focus on government digital services and DPI.**
        2. Do not provide information on historical figures, general knowledge, or topics unrelated to government digital services.
        3. If asked about topics outside your scope, politely redirect the user to your area of expertise.
        4. Respond to queries with relevant, concise information. Use bullet points for lists and numbered steps for processes.
        5. Format key points or important information in bold using ** at the beginning and end of the text.
        6. Maintain a professional, helpful tone. If unsure about specific details, advise users to verify information on official government websites.

        Example redirection: "I apologize, but I'm specialized in Indian government digital services and can't provide information on [topic]. However, I'd be happy to assist you with any questions about digital services like UPI, Aadhaar, or DigiLocker. Is there anything in that area I can help you with?"
        """
        self.chat.send_message(context)

    def set_language(self, language_code):
        self.current_language = language_code

    def get_response(self, user_input):
        if not self.model or not self.chat:
            self.initialize_model()
            if not self.model or not self.chat:
                return "I apologize, but I'm currently experiencing technical difficulties. Please try again later or contact our support team for assistance."

        try:
            # Translate user input to English if not already in English
            if self.current_language != 'en':
                user_input_en = self.translator.translate(user_input, src=self.current_language, dest='en').text
            else:
                user_input_en = user_input

            logging.debug(f"Sending message to model: {user_input_en}")
            response = self.chat.send_message(user_input_en)
            formatted_response = self._format_response(response.text)

            # Translate response back to the user's language if not English
            if self.current_language != 'en':
                formatted_response = self.translator.translate(formatted_response, src='en', dest=self.current_language).text

            logging.debug(f"Formatted response: {formatted_response}")
            return formatted_response
        except Exception as e:
            logging.error(f"Error in get_response: {str(e)}", exc_info=True)
            return "I apologize, but I encountered an error while processing your request. Please try rephrasing your question or contact our support team for assistance."

    def _format_response(self, text):
        lines = text.split('\n')
        formatted_lines = []
        for line in lines:
            line = line.strip()
            if line.startswith('•') or line.startswith('-'):
                formatted_lines.append('\n' + line)
            elif line.lower().startswith(('step', 'note:')):
                formatted_lines.append('\n' + line)
            else:
                formatted_lines.append(line)
        
        return '\n'.join(formatted_lines)

    def get_greeting(self):
        greeting = "Hello! I'm here to help you with information about Indian government digital services and initiatives. How may I assist you today?"
        if self.current_language != 'en':
            greeting = self.translator.translate(greeting, src='en', dest=self.current_language).text
        return greeting