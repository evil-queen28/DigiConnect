import requests
import os
import logging

class UPIIntegration:
    def __init__(self):
        self.api_url = os.getenv("UPI_API_URL")
        self.api_key = os.getenv("UPI_API_KEY")
        self.logger = logging.getLogger(__name__)

    def link_account(self, upi_id):
        try:
            headers = {"Authorization": f"Bearer {self.api_key}"}
            response = requests.post(
                f"{self.api_url}/link",
                json={"upi_id": upi_id},
                headers=headers
            )
            response.raise_for_status()
            return {"success": True, "message": "UPI account linked successfully"}
        except requests.RequestException as e:
            self.logger.error(f"Error linking UPI account: {str(e)}")
            return {"success": False, "error": "Failed to link UPI account"}