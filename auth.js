(function () {
    const USERS_KEY = 'trading_ai_users';
    const SESSION_KEY = 'trading_ai_session';

    function readJson(key, fallback) {
        try {
            const raw = localStorage.getItem(key);
            if (!raw) return fallback;
            return JSON.parse(raw) ?? fallback;
        } catch (error) {
            console.warn('Unable to read auth storage:', error);
            return fallback;
        }
    }

    function writeJson(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    function getUsers() {
        return readJson(USERS_KEY, []);
    }

    function setCurrentUser(user) {
        writeJson(SESSION_KEY, {
            name: user.name,
            email: user.email,
            createdAt: new Date().toISOString()
        });
    }

    function getCurrentUser() {
        return readJson(SESSION_KEY, null);
    }

    function setFormMessage(form, type, text) {
        const target = form.querySelector('[data-form-message]');
        if (!target) return;
        target.className = 'form-message ' + type;
        target.textContent = text;
    }

    function renderAuthState() {
        const loginButton = document.querySelector('[data-auth="login"]');
        const signupButton = document.querySelector('[data-auth="signup"]');
        const userBadge = document.querySelector('[data-auth="user"]');
        const userName = userBadge ? userBadge.querySelector('[data-auth="user-name"]') : null;
        const logoutButton = document.querySelector('[data-auth="logout"]');
        const currentUser = getCurrentUser();

        if (!currentUser) {
            if (loginButton) loginButton.classList.remove('hidden');
            if (signupButton) signupButton.classList.remove('hidden');
            if (userBadge) userBadge.classList.add('hidden');
            if (logoutButton) logoutButton.classList.add('hidden');
            return;
        }

        if (loginButton) loginButton.classList.add('hidden');
        if (signupButton) signupButton.classList.add('hidden');
        if (logoutButton) logoutButton.classList.remove('hidden');
        if (userBadge) {
            userBadge.classList.remove('hidden');
            if (userName) {
                userName.textContent = 'Hi, ' + (currentUser.name || currentUser.email.split('@')[0]);
            }
        }
        if (logoutButton) {
            logoutButton.addEventListener('click', function () {
                localStorage.removeItem(SESSION_KEY);
                renderAuthState();
                if (window.location.pathname.includes('signin.html') || window.location.pathname.includes('signup.html')) {
                    window.location.href = 'index.html';
                }
            }, { once: true });
        }
    }

    function handleSignup(event) {
        event.preventDefault();
        const form = event.currentTarget;
        const name = form.querySelector('#signup-name').value.trim();
        const email = form.querySelector('#signup-email').value.trim();
        const password = form.querySelector('#signup-password').value;

        if (!name || !email || !password) {
            setFormMessage(form, 'error', 'Please complete all fields.');
            return;
        }

        const users = getUsers();
        const emailExists = users.some((user) => user.email.toLowerCase() === email.toLowerCase());
        if (emailExists) {
            setFormMessage(form, 'error', 'An account with this email already exists.');
            return;
        }

        const user = { name, email, password };
        users.push(user);
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
        setCurrentUser(user);
        setFormMessage(form, 'success', 'Account created! Redirecting to your dashboard...');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 600);
    }

    function handleSignin(event) {
        event.preventDefault();
        const form = event.currentTarget;
        const email = form.querySelector('#signin-email').value.trim();
        const password = form.querySelector('#signin-password').value;

        if (!email || !password) {
            setFormMessage(form, 'error', 'Please enter your email and password.');
            return;
        }

        const users = getUsers();
        const user = users.find((entry) => entry.email.toLowerCase() === email.toLowerCase() && entry.password === password);

        if (!user) {
            setFormMessage(form, 'error', 'Invalid email or password.');
            return;
        }

        setCurrentUser(user);
        setFormMessage(form, 'success', 'Login successful! Redirecting...');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 500);
    }

    document.addEventListener('DOMContentLoaded', function () {
        const currentUser = getCurrentUser();
        if (currentUser && (window.location.pathname.includes('signin.html') || window.location.pathname.includes('signup.html'))) {
            window.location.href = 'index.html';
            return;
        }

        renderAuthState();

        const signInForm = document.getElementById('signin-form');
        if (signInForm) {
            signInForm.addEventListener('submit', handleSignin);
        }

        const signUpForm = document.getElementById('signup-form');
        if (signUpForm) {
            signUpForm.addEventListener('submit', handleSignup);
        }

        const logoutButton = document.querySelector('[data-auth="logout"]');
        if (logoutButton) {
            logoutButton.addEventListener('click', function () {
                localStorage.removeItem(SESSION_KEY);
                renderAuthState();
                if (window.location.pathname.includes('signin.html') || window.location.pathname.includes('signup.html')) {
                    window.location.href = 'index.html';
                }
            });
        }
    });
})();
