document.addEventListener('DOMContentLoaded', () => {
  const registerButton = document.getElementById('register-button');
  const loginButton = document.getElementById('login-button');
  const logoutButton = document.getElementById('logout-button');

  if (registerButton) {
    registerButton.addEventListener('click', (e) => {
      e.preventDefault();
      openAuthPopup('Sign Up', handleSignUp);
    });
  }

  if (loginButton) {
    loginButton.addEventListener('click', (e) => {
      e.preventDefault();
      openAuthPopup('Login', handleLogin);
    });
  }

  if (logoutButton) {
    logoutButton.addEventListener('click', (e) => {
      e.preventDefault();
      handleLogout();
    });
  }
});

let popup; // Cache popup for reuse
function openAuthPopup(title, callback) {
  if (!popup) {
    popup = document.createElement('div');
    popup.id = 'auth-popup';
    popup.className = 'auth-popup';
    document.body.appendChild(popup);

    const popupContent = document.createElement('div');
    popupContent.className = 'auth-popup-content';

    const popupTitle = document.createElement('h2');
    const usernameInput = document.createElement('input');
    const passwordInput = document.createElement('input');
    const submitButton = document.createElement('button');
    const cancelButton = document.createElement('button');

    usernameInput.type = 'text';
    usernameInput.placeholder = 'Username';
    passwordInput.type = 'password';
    passwordInput.placeholder = 'Password';
    submitButton.textContent = 'Submit';
    cancelButton.textContent = 'Cancel';

    popupContent.append(
      popupTitle,
      usernameInput,
      passwordInput,
      submitButton,
      cancelButton
    );
    popup.appendChild(popupContent);

    submitButton.addEventListener('click', () => {
      if (validateInputs(usernameInput.value, passwordInput.value)) {
        callback(usernameInput.value, passwordInput.value);
        popup.style.display = 'none';
      }
    });

    cancelButton.addEventListener('click', () => {
      popup.style.display = 'none';
    });
  }

  popup.querySelector('h2').textContent = title;
  popup.style.display = 'flex';
}

function validateInputs(username, password) {
  if (!username || !password) {
    alert('Please enter both username and password.');
    return false;
  }
  return true;
}

async function handleSignUp(username, password) {
  try {
    const response = await fetch('/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (response.ok) {
      alert('Registration successful! Please log in.');
    } else {
      alert('Error during registration.');
    }
  } catch (error) {
    console.error('Sign up error:', error);
  }
}

async function handleLogin(username, password) {
  try {
    const response = await fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (response.ok) {
      alert('Login successful!');
      window.location.reload();
    } else {
      alert('Invalid login credentials.');
    }
  } catch (error) {
    console.error('Login error:', error);
  }
}

async function handleLogout() {
  try {
    const response = await fetch('/logout', { method: 'POST' });
    if (response.ok) {
      alert('Logout successful!');
      window.location.reload();
    } else {
      alert('Error during logout.');
    }
  } catch (error) {
    console.error('Logout error:', error);
  }
}
