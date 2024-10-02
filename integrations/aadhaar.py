import requests
import os
import logging
from cryptography.fernet import Fernet

class AadhaarIntegration:
    def __init__(self):
        self.api_url = os.getenv("AADHAAR_API_URL")
        self.api_key = os.getenv("AADHAAR_API_KEY")
        self.encryption_key = os.getenv("AADHAAR_ENCRYPTION_KEY").encode()
        self.fernet = Fernet(self.encryption_key)
        self.logger = logging.getLogger(__name__)

    def encrypt_data(self, data):
        return self.fernet.encrypt(data.encode()).decode()

    def decrypt_data(self, encrypted_data):
        return self.fernet.decrypt(encrypted_data.encode()).decode()

    def verify_aadhaar(self, aadhaar_number):
        try:
            headers = {"Authorization": f"Bearer {self.api_key}"}
            response = requests.post(
                f"{self.api_url}/verify",
                json={"aadhaar_number": self.encrypt_data(aadhaar_number)},
                headers=headers
            )
            response.raise_for_status()
            return {"success": True, "message": "Aadhaar number verified successfully"}
        except requests.RequestException as e:
            self.logger.error(f"Error verifying Aadhaar: {str(e)}")
            return {"success": False, "error": "Failed to verify Aadhaar number"}

    def generate_otp(self, aadhaar_number):
        try:
            headers = {"Authorization": f"Bearer {self.api_key}"}
            response = requests.post(
                f"{self.api_url}/generate_otp",
                json={"aadhaar_number": self.encrypt_data(aadhaar_number)},
                headers=headers
            )
            response.raise_for_status()
            return {"success": True, "message": "OTP sent successfully"}
        except requests.RequestException as e:
            self.logger.error(f"Error generating OTP: {str(e)}")
            return {"success": False, "error": "Failed to generate OTP"}

    def verify_otp(self, aadhaar_number, otp):
        try:
            headers = {"Authorization": f"Bearer {self.api_key}"}
            response = requests.post(
                f"{self.api_url}/verify_otp",
                json={
                    "aadhaar_number": self.encrypt_data(aadhaar_number),
                    "otp": self.encrypt_data(otp)
                },
                headers=headers
            )
            response.raise_for_status()
            return {"success": True, "message": "OTP verified successfully"}
        except requests.RequestException as e:
            self.logger.error(f"Error verifying OTP: {str(e)}")
            return {"success": False, "error": "Failed to verify OTP"}

    def get_aadhaar_details(self, aadhaar_number):
        try:
            headers = {"Authorization": f"Bearer {self.api_key}"}
            response = requests.get(
                f"{self.api_url}/details",
                params={"aadhaar_number": self.encrypt_data(aadhaar_number)},
                headers=headers
            )
            response.raise_for_status()
            encrypted_details = response.json()
            decrypted_details = {k: self.decrypt_data(v) for k, v in encrypted_details.items()}
            return {"success": True, "details": decrypted_details}
        except requests.RequestException as e:
            self.logger.error(f"Error fetching Aadhaar details: {str(e)}")
            return {"success": False, "error": "Failed to fetch Aadhaar details"}