// auth.js
// Implements a simple client-side authentication system using localStorage.
// Users can register with a username, email and password. Credentials
// are stored in the browser's localStorage under the key 'sns-users'.
// The currently logged-in user is stored under the key 'sns-user'.
// NOTE: This is intended only for prototyping and does not provide
// real security. For production use, implement server-side authentication.

(function() {
  const usersKey = 'sns-users';
  const userKey = 'sns-user';

  // Helper to load users array from localStorage
  function loadUsers() {
    const data = localStorage.getItem(usersKey);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch (err) {
      console.error('Failed to parse users', err);
      return [];
    }
  }

  // Helper to save users array to localStorage
  function saveUsers(users) {
    try {
      localStorage.setItem(usersKey, JSON.stringify(users));
    } catch (err) {
      console.error('Failed to save users', err);
    }
  }

  // Very simple password hash using Base64. This is NOT secure.
  function hashPassword(pw) {
    try {
      return btoa(unescape(encodeURIComponent(pw)));
    } catch (err) {
      // fallback plain if encoding fails
      return pw;
    }
  }

  // Register a new user. Returns true on success, false otherwise.
  function registerUser(username, email, password) {
    const users = loadUsers();
    // Check for duplicate email
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      alert('このメールアドレスは既に登録されています。');
      return false;
    }
    const newUser = {
      id: Date.now().toString(),
      name: username,
      username: username,
      email: email,
      passwordHash: hashPassword(password)
    };
    users.push(newUser);
    saveUsers(users);
    // Save current user to login automatically
    localStorage.setItem(userKey, JSON.stringify({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email
    }));
    return true;
  }

  // Attempt to log in with provided credentials. Returns true on success.
  function loginUser(email, password) {
    const users = loadUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      alert('メールアドレスが見つかりません。');
      return false;
    }
    if (user.passwordHash !== hashPassword(password)) {
      alert('パスワードが正しくありません。');
      return false;
    }
    // Store minimal user info
    localStorage.setItem(userKey, JSON.stringify({
      id: user.id,
      name: user.name,
      email: user.email
    }));
    return true;
  }
function logout() {
  localStorage.removeItem(userKey);
  updateUI();
  // Redirect to login page
  window.location.href = 'index.html';
}
  

  // Show register form and hide login form
  function showRegister() {
    const loginFormContainer = document.getElementById('loginFormContainer');
    const registerFormContainer = document.getElementById('registerFormContainer');
    if (loginFormContainer) loginFormContainer.classList.add('hidden');
    if (registerFormContainer) registerFormContainer.classList.remove('hidden');
  }

  // Show login form and hide register form
  function showLogin() {
    const loginFormContainer = document.getElementById('loginFormContainer');
    const registerFormContainer = document.getElementById('registerFormContainer');
    if (registerFormContainer) registerFormContainer.classList.add('hidden');
    if (loginFormContainer) loginFormContainer.classList.remove('hidden');
  }

  // Update UI based on login state
  function updateUI() {
    const userStr = localStorage.getItem(userKey);
    const authContainer = document.getElementById('authContainer');
    const userInfoDiv = document.getElementById('userInfo');
    const userNameSpan = document.getElementById('userName');
    const postFormSection = document.getElementById('postSection');
    const feedEl = document.getElementById('feedSection');
    // Grab additional UI elements for navigation and secondary sections
    const navBar = document.getElementById('navBar');
    const categoriesBar = document.getElementById('categoriesBar');
    const searchSection = document.getElementById('searchSection');
    const profileSection = document.getElementById('profileSection');
    if (!userStr) {
      // No current user: show authentication forms, hide user info and all app sections
      if (authContainer) authContainer.classList.remove('hidden');
      if (userInfoDiv) userInfoDiv.classList.add('hidden');
      if (postFormSection) postFormSection.classList.add('hidden');
      if (feedEl) feedEl.classList.add('hidden');
      if (navBar) navBar.classList.add('hidden');
      if (categoriesBar) categoriesBar.classList.add('hidden');
      if (searchSection) searchSection.classList.add('hidden');
      if (profileSection) profileSection.classList.add('hidden');
    } else {
      // Logged in: hide auth forms, show user info and navigation; other sections will be handled in app.js
      if (authContainer) authContainer.classList.add('hidden');
      if (userInfoDiv) userInfoDiv.classList.remove('hidden');
      try {
        const user = JSON.parse(userStr);
        if (userNameSpan) userNameSpan.textContent = user.name || user.email;
      } catch (err) {
        if (userNameSpan) userNameSpan.textContent = '';
      }
      if (postFormSection) postFormSection.classList.remove('hidden');
      if (feedEl) feedEl.classList.remove('hidden');
      if (navBar) navBar.classList.remove('hidden');
      // Keep categories/search/profile sections hidden initially; app.js will show the correct one
      if (categoriesBar) categoriesBar.classList.add('hidden');
      if (searchSection) searchSection.classList.add('hidden');
      if (profileSection) profileSection.classList.add('hidden');
      // Assign logout handler
      const logoutButton = document.getElementById('logoutButton');
      if (logoutButton) {
        logoutButton.onclick = logout;
      }
    }
  }

  // Initialize event listeners
  function init() {
    updateUI();
    // Register event for showing register form
    const showRegisterLink = document.getElementById('showRegister');
    if (showRegisterLink) {
      showRegisterLink.addEventListener('click', (e) => {
        e.preventDefault();
        showRegister();
      });
    }
    // Register event for showing login form
    const showLoginLink = document.getElementById('showLogin');
    if (showLoginLink) {
      showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        showLogin();
      });
    }
    // Handle login form submission
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        if (loginUser(email, password)) {
                   window.location.href = 'app.html';
          
          );
    }
    // Handle registration form submission
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
      registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('registerUsername').value.trim();
        const email = document.getElementById('registerEmail').value.trim();
        const password = document.getElementById('registerPassword').value;
        if (!username || !email || !password) {
          alert('全てのフィールドを入力してください。');
          return;
        }
        if (registerUser(username, email, password)) {
                  window.location.href = 'app.html';
          
          
          
      });
    }
  }

  window.addEventListener('DOMContentLoaded', init);
})();
