import requests
import os
import logging
from oauthlib.oauth2 import BackendApplicationClient
from requests_oauthlib import OAuth2Session

class DigiLockerIntegration:
    def __init__(self):
        self.api_url = os.getenv("DIGILOCKER_API_URL")
        self.client_id = os.getenv("DIGILOCKER_CLIENT_ID")
        self.client_secret = os.getenv("DIGILOCKER_CLIENT_SECRET")
        self.redirect_uri = os.getenv("DIGILOCKER_REDIRECT_URI")
        self.logger = logging.getLogger(__name__)
        self.oauth = OAuth2Session(client=BackendApplicationClient(client_id=self.client_id))

    def get_auth_url(self):
        auth_url, _ = self.oauth.authorization_url(f"{self.api_url}/oauth2/authorize")
        return auth_url

    def handle_callback(self, code):
        try:
            token = self.oauth.fetch_token(
                f"{self.api_url}/oauth2/token",
                code=code,
                client_secret=self.client_secret
            )
            # Here you would typically save the token securely
            return {"success": True, "message": "DigiLocker account linked successfully"}
        except Exception as e:
            self.logger.error(f"Error handling DigiLocker callback: {str(e)}")
            return {"success": False, "error": "Failed to link DigiLocker account"}

    def get_issued_documents(self):
        try:
            response = self.oauth.get(f"{self.api_url}/v2/issueddocuments")
            response.raise_for_status()
            return {"success": True, "documents": response.json()}
        except Exception as e:
            self.logger.error(f"Error fetching issued documents: {str(e)}")
            return {"success": False, "error": "Failed to fetch issued documents"}

    def get_file(self, uri):
        try:
            response = self.oauth.get(f"{self.api_url}/v2/file/{uri}")
            response.raise_for_status()
            return {"success": True, "file_content": response.content}
        except Exception as e:
            self.logger.error(f"Error fetching file: {str(e)}")
            return {"success": False, "error": "Failed to fetch file"}

    def pull_aadhaar(self):
        try:
            response = self.oauth.get(f"{self.api_url}/v2/aadhaar/pull")
            response.raise_for_status()
            return {"success": True, "aadhaar_data": response.json()}
        except Exception as e:
            self.logger.error(f"Error pulling Aadhaar: {str(e)}")
            return {"success": False, "error": "Failed to pull Aadhaar data"}

    def share_document(self, uri, recipient):
        try:
            data = {"uri": uri, "recipient": recipient}
            response = self.oauth.post(f"{self.api_url}/v2/share", json=data)
            response.raise_for_status()
            return {"success": True, "message": "Document shared successfully"}
        except Exception as e:
            self.logger.error(f"Error sharing document: {str(e)}")
            return {"success": False, "error": "Failed to share document"}