document.addEventListener('DOMContentLoaded', () => {
  const registerButton = document.getElementById('register-button');
  const loginButton = document.getElementById('login-button');
  const logoutButton = document.getElementById('logout-button');

  if (registerButton) {
    registerButton.addEventListener('click', (e) => {
      e.preventDefault();
      createAuthPopup('Sign Up', handleSignUp);
    });
  }

  if (loginButton) {
    loginButton.addEventListener('click', (e) => {
      e.preventDefault();
      createAuthPopup('Login', handleLogin);
    });
  }

  if (logoutButton) {
    logoutButton.addEventListener('click', (e) => {
      e.preventDefault();
      handleLogout();
    });
  }
});

function createAuthPopup(title, callback) {
  const existingPopup = document.getElementById('auth-popup');
  if (existingPopup) {
    existingPopup.remove();
  }

  const popup = document.createElement('div');
  popup.id = 'auth-popup';
  popup.className = 'auth-popup';

  const popupContent = document.createElement('div');
  popupContent.className = 'auth-popup-content';

  const popupTitle = document.createElement('h2');
  popupTitle.textContent = title;

  const usernameInput = document.createElement('input');
  usernameInput.type = 'text';
  usernameInput.placeholder = 'Username';

  const passwordInput = document.createElement('input');
  passwordInput.type = 'password';
  passwordInput.placeholder = 'Password';

  const submitButton = document.createElement('button');
  submitButton.textContent = 'Submit';

  const cancelButton = document.createElement('button');
  cancelButton.textContent = 'Cancel';

  popupContent.append(
    popupTitle,
    usernameInput,
    passwordInput,
    submitButton,
    cancelButton
  );
  popup.appendChild(popupContent);
  document.body.appendChild(popup);

  submitButton.addEventListener('click', () => {
    const username = usernameInput.value;
    const password = passwordInput.value;

    if (username && password) {
      callback(username, password);
      popup.remove();
    } else {
      alert('Please enter both username and password.');
    }
  });

  cancelButton.addEventListener('click', () => {
    popup.remove();
  });
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
