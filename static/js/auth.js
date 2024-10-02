document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signup-form');
    const verifyEmailButton = document.getElementById('verify-email');
    const emailOtpInput = document.getElementById('email-otp');
    const submitEmailOtpButton = document.getElementById('submit-email-otp');
    const emailVerifiedSpan = document.getElementById('email-verified');
    const submitButton = document.getElementById('submit-button');
    let emailVerified = false;
    
    const captchaInput = document.getElementById('captcha');
    const verifyCaptchaButton = document.getElementById('verify-captcha');
    const captchaVerifiedSpan = document.getElementById('captcha-verified');
    const captchaImage = document.getElementById('captcha-image');
    
    let captchaVerified = false;
    
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const passwordRequirements = document.getElementById('password-requirements');
    const passwordMatch = document.getElementById('password-match');
    const requirementElements = {
        length: document.getElementById('length'),
        lowercase: document.getElementById('lowercase'),
        uppercase: document.getElementById('uppercase'),
        number: document.getElementById('number'),
        special: document.getElementById('special')
    };
    


    passwordInput.addEventListener('input', function() {
        const password = this.value;
        passwordRequirements.style.display = password ? 'block' : 'none';
        
        const allRequirementsMet = checkPasswordStrength(password);
        if (allRequirementsMet) {
            passwordRequirements.style.display = 'none';
        }
        checkPasswordsMatch();
    });

    confirmPasswordInput.addEventListener('input', checkPasswordsMatch);

    function checkPasswordStrength(password) {
        const requirements = {
            length: password.length >= 8,
            lowercase: /[a-z]/.test(password),
            uppercase: /[A-Z]/.test(password),
            number: /\d/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        };

        let allMet = true;
        for (const [requirement, met] of Object.entries(requirements)) {
            requirementElements[requirement].classList.toggle('met', met);
            if (!met) allMet = false;
        }

        return allMet;
    }

    function checkPasswordsMatch() {
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        const match = password && confirmPassword && password === confirmPassword;
        
        passwordMatch.style.display = confirmPassword ? 'block' : 'none';
        passwordMatch.textContent = match ? 'Passwords match' : 'Passwords do not match';
        passwordMatch.style.color = match ? 'green' : 'red';
    }

    async function makeRequest(url, method, data) {
        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.error || 'Network response was not ok');
            }

            return responseData;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }

    async function sendOtp(type, value) {
        try {
            const data = await makeRequest('/send_otp', 'POST', { type, value });
            if (data.sent) {
                alert('Verification code sent successfully. Please check your email.');
                verifyEmailButton.style.display = 'none';
                emailOtpInput.style.display = 'inline-block';
                submitEmailOtpButton.style.display = 'inline-block';
            } else {
                alert('Failed to send verification code. Please try again.');
            }
        } catch (error) {
            alert('An error occurred while sending verification code: ' + error.message);
        }
    }

    async function verifyOtp(type, otp) {
        try {
            const data = await makeRequest('/verify_otp', 'POST', { type, otp });
            if (data.verified) {
                emailOtpInput.style.display = 'none';
                submitEmailOtpButton.style.display = 'none';
                emailVerifiedSpan.style.display = 'inline';
                emailVerifiedSpan.textContent = 'Email verified';
                emailVerified = true;
                updateSubmitButtonState();
            } else {
                alert('Invalid verification code. Please try again.');
            }
        } catch (error) {
            alert('An error occurred while verifying the code: ' + error.message);
        }
    }

    function updateSubmitButtonState() {
        submitButton.disabled = !(emailVerified && captchaVerified);
    }

    if (verifyEmailButton) {
        verifyEmailButton.addEventListener('click', () => {
            const email = document.getElementById('email').value;
            if (email) {
                sendOtp('email', email);
            } else {
                alert('Please enter an email address.');
            }
        });
    }

    if (submitEmailOtpButton) {
        submitEmailOtpButton.addEventListener('click', () => {
            const otp = emailOtpInput.value;
            if (otp) {
                verifyOtp('email', otp);
            } else {
                alert('Please enter the verification code.');
            }
        });
    }

    if (emailOtpInput) {
        emailOtpInput.addEventListener('keyup', (event) => {
            if (event.key === 'Enter') {
                verifyOtp('email', emailOtpInput.value);
            }
        });
    }

    async function refreshCaptcha() {
        try {
            const response = await fetch('/get_captcha');
            const data = await response.json();
            captchaImage.src = data.captcha_image;
            captchaInput.value = '';
            captchaVerifiedSpan.style.display = 'none';
            verifyCaptchaButton.style.display = 'inline-block';
            captchaInput.disabled = false;
            captchaVerified = false;
            updateSubmitButtonState();
        } catch (error) {
            console.error('Failed to refresh CAPTCHA:', error);
        }
    }

    verifyCaptchaButton.addEventListener('click', async function() {
        const captchaResponse = captchaInput.value;
        try {
            const response = await fetch('/verify_captcha', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ captcha: captchaResponse }),
            });
            const data = await response.json();
            if (data.verified) {
                captchaVerifiedSpan.style.display = 'inline';
                verifyCaptchaButton.style.display = 'none';
                captchaInput.disabled = true;
                captchaVerified = true;
                updateSubmitButtonState();
            } else {
                alert('Invalid CAPTCHA. Please try again.');
                refreshCaptcha();
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while verifying CAPTCHA. Please try again.');
        }
    });

    captchaImage.addEventListener('click', refreshCaptcha);

    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            const phoneNumber = document.getElementById('phone_number').value;
            const captchaResponse = document.getElementById('captcha').value;
            const recaptchaResponse = grecaptcha.getResponse();
    
            if (password !== confirmPassword) {
                alert("Passwords don't match");
                return;
            }
    
            if (!captchaResponse) {
                alert("Please verify the CAPTCHA before submitting.");
                return;
            }
    
            if (!recaptchaResponse) {
                alert("Please verify the reCAPTCHA before submitting.");
                return;
            }
    
            const formData = new FormData();
            formData.append('username', username);
            formData.append('email', email);
            formData.append('password', password);
            formData.append('phone_number', phoneNumber);
            formData.append('captcha', captchaResponse);
            formData.append('g-recaptcha-response', recaptchaResponse);
    
            fetch('/signup', {
                method: 'POST',
                body: formData,
            })
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    alert(data.message);
                    if (data.message === 'Account created successfully') {
                        alert('Please check your email for a confirmation message.');
                        window.location.href = '/signin';
                    }
                } else if (data.error) {
                    alert(data.error);
                }
                refreshCaptcha();
                grecaptcha.reset();
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('An error occurred during signup: ' + error.message);
                refreshCaptcha();
                grecaptcha.reset();
            });
        });
    }


    // ... (signin and reset password form handlers remain the same)
    const form = document.getElementById('signin-form');
    const signinOptions = document.querySelectorAll('.signin-option');
    const inputs = {
        mobile: document.getElementById('mobile-input'),
        username: document.getElementById('username-input'),
        email: document.getElementById('email-input')
    };

    signinOptions.forEach(option => {
        option.addEventListener('click', function() {
            const selectedOption = this.getAttribute('data-option');
            signinOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');

            Object.keys(inputs).forEach(key => {
                const input = inputs[key].querySelector('input');
                if (key === selectedOption) {
                    inputs[key].style.display = 'block';
                    input.setAttribute('required', '');
                } else {
                    inputs[key].style.display = 'none';
                    input.removeAttribute('required');
                }
            });
        });
    });

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        if (form.checkValidity()) {
            form.submit();
        } else {
            // Trigger browser's default validation UI
            form.reportValidity();
        }
    });

    if (resetPasswordForm) {
        resetPasswordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('email')?.value;
            const captchaResponse = document.getElementById('captcha')?.value;
            const recaptchaResponse = grecaptcha?.getResponse();

            if (!captchaResponse) {
                alert("Please complete the CAPTCHA");
                return;
            }

            if (!recaptchaResponse) {
                alert("Please complete the reCAPTCHA");
                return;
            }

            const formData = new FormData();
            formData.append('email', email);
            formData.append('captcha', captchaResponse);
            formData.append('g-recaptcha-response', recaptchaResponse);

            fetch('/reset_password', {
                method: 'POST',
                body: formData,
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.message) {
                    alert(data.message);
                    if (data.message === 'Password reset email sent') {
                        window.location.href = '/signin';
                    }
                } else if (data.error) {
                    alert(data.error);
                }
                refreshCaptcha();
                grecaptcha.reset();
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('An error occurred during password reset. Please try again.');
                refreshCaptcha();
                grecaptcha.reset();
            });
        });
    }
    
});