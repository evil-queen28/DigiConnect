document.addEventListener('DOMContentLoaded', function() {
    const profileForm = document.getElementById('profile-form');
    const profilePicture = document.getElementById('profile-picture');
    const profilePictureInput = document.getElementById('profile-picture-input');

    profilePictureInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                profilePicture.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    profileForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(profileForm);

        fetch('/api/update_profile', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Profile updated successfully!');
                
                // Check if the profile picture was updated
                if (data.profile_picture) {
                    const newProfilePicUrl = `/static/images/profile_pictures/${data.profile_picture}`;
                    profilePicture.src = newProfilePicUrl;
                    
                    // Update the profile picture on the main page
                    if (window.opener) {
                        window.opener.postMessage({ type: 'profileUpdate', profilePicUrl: newProfilePicUrl }, '*');
                    }
                }
            } else {
                alert('Failed to update profile. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        });
    });
});
