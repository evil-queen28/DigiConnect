document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Add active class to navigation items on scroll
    window.addEventListener('scroll', function() {
        let scrollPosition = window.scrollY;

        document.querySelectorAll('section').forEach(section => {
            if (scrollPosition >= section.offsetTop - 50 && scrollPosition < (section.offsetTop + section.offsetHeight - 50)) {
                let currentId = section.attributes.id.value;
                removeAllActiveClasses();
                addActiveClass(currentId);
            }
        });
    });

    function removeAllActiveClasses() {
        document.querySelectorAll("nav ul li a").forEach((el) => {
            el.classList.remove("active");
        });
    }

    function addActiveClass(id) {
        let selector = `nav ul li a[href="#${id}"]`;
        document.querySelector(selector).classList.add("active");
    }
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Add active class to navigation items on scroll
    window.addEventListener('scroll', function() {
        let scrollPosition = window.scrollY;

        document.querySelectorAll('section').forEach(section => {
            if (scrollPosition >= section.offsetTop - 50 && scrollPosition < (section.offsetTop + section.offsetHeight - 50)) {
                let currentId = section.attributes.id.value;
                removeAllActiveClasses();
                addActiveClass(currentId);
            }
        });
    });

    function removeAllActiveClasses() {
        document.querySelectorAll("nav ul li a").forEach((el) => {
            el.classList.remove("active");
        });
    }

    function addActiveClass(id) {
        let selector = `nav ul li a[href="#${id}"]`;
        document.querySelector(selector).classList.add("active");
    }
    
    // Add event listeners for signup and signin buttons
    const signupBtn = document.getElementById('signup-btn');
    const signinBtn = document.getElementById('signin-btn');

    if (signupBtn) {
        signupBtn.addEventListener('click', function() {
            window.location.href = '/signup';
        });
    }

    if (signinBtn) {
        signinBtn.addEventListener('click', function() {
            window.location.href = '/signin';
        });
    }
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            window.location.href = '/logout';
        });
    }
    document.addEventListener('DOMContentLoaded', function() {
        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });
    
        // Add active class to navigation items on scroll
        const addActiveClassOnScroll = () => {
            const scrollPosition = window.scrollY;
            document.querySelectorAll('section').forEach(section => {
                if (scrollPosition >= section.offsetTop - 50 && 
                    scrollPosition < (section.offsetTop + section.offsetHeight - 50)) {
                    const currentId = section.id;
                    document.querySelectorAll("nav ul li a").forEach((el) => {
                        el.classList.toggle("active", el.getAttribute('href') === `#${currentId}`);
                    });
                }
            });
        };
    
        window.addEventListener('scroll', addActiveClassOnScroll);
    
        // Add event listeners for signup and signin buttons
        const signupBtn = document.getElementById('signup-btn');
        const signinBtn = document.getElementById('signin-btn');
    
        if (signupBtn) {
            signupBtn.addEventListener('click', function() {
                window.location.href = '/signup';
            });
        }
    
        if (signinBtn) {
            signinBtn.addEventListener('click', function() {
                window.location.href = '/signin';
            });
        }
    
        // Add event listener for logout button
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function() {
                window.location.href = '/logout';
            });
        }
    
        // Function to check authentication and update UI dynamically
        const checkAuth = async () => {
            try {
                const response = await fetch('/api/check_auth');
                const data = await response.json();
    
                const authContainer = document.getElementById('auth-container');
                if (!authContainer) return;
    
                if (data.authenticated) {
                    authContainer.innerHTML = `
                        <div class="user-profile">
                            <div class="user-info">
                                <img src="${data.profile_picture}" alt="User Profile Picture" class="profile-pic">
                                <span>${data.username}</span>
                            </div>
                            <div class="dropdown-content">
                                <a href="/profile">Edit Profile</a>
                                <a href="/logout" id="logout-btn">Logout</a>
                            </div>
                        </div>
                    `;
                } else {
                    authContainer.innerHTML = `
                        <button id="signup-btn" class="button">Sign Up</button>
                        <button id="signin-btn" class="button">Sign In</button>
                    `;
                }
            } catch (error) {
                console.error('Error fetching auth status:', error);
            }
        };
    
        checkAuth();
    });
    
});