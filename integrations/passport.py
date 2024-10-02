import requests
import os
import logging

class PassportIntegration:
    def __init__(self):
        self.api_url = os.getenv("PASSPORT_API_URL")
        self.api_key = os.getenv("PASSPORT_API_KEY")
        self.logger = logging.getLogger(__name__)

    def apply_passport(self, passport_data):
        try:
            headers = {"Authorization": f"Bearer {self.api_key}"}
            response = requests.post(
                f"{self.api_url}/apply",
                json=passport_data,
                headers=headers
            )
            response.raise_for_status()
            result = response.json()
            return {
                "success": True,
                "message": "Passport application submitted successfully",
                "application_id": result.get("application_id")
            }
        except requests.RequestException as e:
            self.logger.error(f"Error applying for passport: {str(e)}")
            return {"success": False, "error": "Failed to submit passport application"}