// DOM elements
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const loginFormDiv = document.getElementById('login-form');
const signupFormDiv = document.getElementById('signup-form');

// Check if user is already logged in
if (localStorage.getItem('currentUser')) {
    window.location.href = 'index.html';
}

// Form handling
signupForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const data = {
        username: document.getElementById('signupName').value,
        email: document.getElementById('signupEmail').value,
        password: document.getElementById('signupPassword').value
    };
    handleSignup(data);
});

loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const data = {
        email: document.getElementById('loginEmail').value,
        password: document.getElementById('loginPassword').value
    };
    handleLogin(data);
});

// Signup handler
function handleSignup(data) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (users.some(u => u.email === data.email)) {
        showError('Email already exists');
        return;
    }
    
    const user = {
        id: Date.now(),
        username: data.username,
        email: data.email,
        password: data.password,
        created_at: new Date().toISOString()
    };
    
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(user));
    window.location.href = 'index.html';
}

// Login handler
function handleLogin(data) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === data.email && u.password === data.password);
    
    if (!user) {
        showError('Invalid email or password');
        return;
    }
    
    localStorage.setItem('currentUser', JSON.stringify(user));
    window.location.href = 'index.html';
}

// Error display
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message bg-red-500 text-white p-2 rounded mb-4';
    errorDiv.textContent = message;
    
    const authContainer = document.querySelector('.bg-gray-800');
    authContainer.insertBefore(errorDiv, authContainer.firstChild);
    
    setTimeout(() => errorDiv.remove(), 3000);
}

// Toggle between login and signup forms
document.getElementById('showSignup').addEventListener('click', function(e) {
    e.preventDefault();
    loginFormDiv.classList.add('hidden');
    signupFormDiv.classList.remove('hidden');
});

document.getElementById('showLogin').addEventListener('click', function(e) {
    e.preventDefault();
    signupFormDiv.classList.add('hidden');
    loginFormDiv.classList.remove('hidden');
}); 