// auth.js
// Handles client-side authentication using Google Identity Services.
// This script renders a Google sign-in button and manages the
// authenticated user state. After successful login, user details
// are stored in localStorage under the key 'sns-user'. To make this
// work you must replace YOUR_GOOGLE_CLIENT_ID with a valid OAuth 2.0
// client ID obtained from Google Cloud Console.

(function() {
  const CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID';
  const userKey = 'sns-user';

  // Decode JWT token (credential) returned by Google. The response
  // contains a base64-encoded JSON payload. We decode and parse it to
  // extract user information.
  function decodeJwt(token) {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    try {
      const payload = parts[1]
        .replace(/-/g, '+')
        .replace(/_/g, '/');
      const decoded = JSON.parse(atob(payload));
      return decoded;
    } catch (err) {
      console.error('Failed to decode JWT:', err);
      return null;
    }
  }

  // Called when Google returns a credential. We decode the JWT and
  // persist minimal user info to localStorage. Then update the UI.
  function handleCredentialResponse(response) {
    const data = decodeJwt(response.credential);
    if (data) {
      const user = {
        id: data.sub,
        name: data.name,
        email: data.email,
        picture: data.picture
      };
      localStorage.setItem(userKey, JSON.stringify(user));
      updateAuthUI();
      // reload the page to ensure app.js picks up the user and re-renders
      location.reload();
    }
  }

  // Update UI elements based on login state. When logged out, show
  // the Google sign-in button container. When logged in, display the
  // user's name and a logout button. The logout button clears
  // localStorage and refreshes the page.
  function updateAuthUI() {
    const userStr = localStorage.getItem(userKey);
    const loginContainer = document.getElementById('loginContainer');
    const userInfoDiv = document.getElementById('userInfo');
    const userNameSpan = document.getElementById('userName');
    const logoutButton = document.getElementById('logoutButton');
    if (!userStr) {
      // no user: show login container
      if (loginContainer) loginContainer.classList.remove('hidden');
      if (userInfoDiv) userInfoDiv.classList.add('hidden');
    } else {
      const user = JSON.parse(userStr);
      if (loginContainer) loginContainer.classList.add('hidden');
      if (userInfoDiv) userInfoDiv.classList.remove('hidden');
      if (userNameSpan) {
        userNameSpan.textContent = user.name || user.email;
      }
      if (logoutButton) {
        logoutButton.onclick = () => {
          localStorage.removeItem(userKey);
          updateAuthUI();
          location.reload();
        };
      }
    }
  }

  // Initialize the Google sign-in library and render the button. The
  // initialization must occur after the script loads and DOM is ready.
  function init() {
    updateAuthUI();
    if (typeof google === 'undefined' || !google.accounts || !google.accounts.id) {
      console.warn('Google Identity Services not loaded');
      return;
    }
    google.accounts.id.initialize({
      client_id: CLIENT_ID,
      callback: handleCredentialResponse
    });
    const loginContainer = document.getElementById('loginContainer');
    if (loginContainer) {
      google.accounts.id.renderButton(loginContainer, {
        theme: 'outline',
        size: 'medium',
        text: 'signin_with',
        locale: 'ja'
      });
    }
    // Optionally display the One Tap prompt
    google.accounts.id.prompt();
  }

  // Wait for DOMContentLoaded before initializing
  window.addEventListener('DOMContentLoaded', init);
})();
