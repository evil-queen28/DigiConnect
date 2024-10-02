document.addEventListener('DOMContentLoaded', function() {
    const profilePic = document.getElementById('profile-pic');
    const dropdown = document.getElementById('dropdown');

    if (profilePic) {
        profilePic.addEventListener('click', function(event) {
            event.stopPropagation();
            dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        });
    }

    // Close the dropdown if the user clicks outside of it
    window.addEventListener('click', function() {
        if (dropdown) {
            dropdown.style.display = 'none';
        }
    });

    // Listen for profile update messages
    window.addEventListener('message', function(event) {
        if (event.data.type === 'profileUpdate') {
            const mainPageProfilePic = document.querySelector('.user-profile .profile-pic');
            if (mainPageProfilePic) {
                mainPageProfilePic.src = event.data.profilePicUrl;
            }
        }
    });
});