document.addEventListener('DOMContentLoaded', () => {
    const upiForm = document.getElementById('upi-form');
    const digilockerAuthButton = document.getElementById('digilocker-auth');
    const aadhaarForm = document.getElementById('aadhaar-form');
    const passportForm = document.getElementById('passport-form');

    upiForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const upiId = document.getElementById('upi-id').value;
        try {
            const response = await fetch('/api/upi/link', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ upi_id: upiId })
            });
            const result = await response.json();
            alert(result.message);
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while linking UPI account');
        }
    });

    digilockerAuthButton.addEventListener('click', async () => {
        try {
            const response = await fetch('/api/digilocker/auth');
            const result = await response.json();
            window.location.href = result.auth_url;
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while authenticating with DigiLocker');
        }
    });

    aadhaarForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const aadhaarNumber = document.getElementById('aadhaar-number').value;
        try {
            const response = await fetch('/api/aadhaar/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ aadhaar_number: aadhaarNumber })
            });
            const result = await response.json();
            alert(result.message);
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while verifying Aadhaar');
        }
    });

    passportForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(passportForm);
        const passportData = Object.fromEntries(formData.entries());
        try {
            const response = await fetch('/api/passport/apply', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(passportData)
            });
            const result = await response.json();
            alert(result.message);
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while applying for passport');
        }
    });
});