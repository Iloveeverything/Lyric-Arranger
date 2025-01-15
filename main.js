document.addEventListener('DOMContentLoaded', () => {
  fetch('/lyrics')
    .then((response) => response.json())
    .then((data) => {
      renderLyrics(data);
      enableDynamicArrangement();
      checkAuthState();
    })
    .catch((error) => console.error('Error Fetching Lyrics:', error));
});

function checkAuthState() {
  fetch('/auth-status')
    .then((response) => {
      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);
      return response.json();
    })
    .then((data) => {
      const loginButton = document.getElementById('login-button');
      const logoutButton = document.getElementById('logout-button');
      if (data.authenticated) {
        loginButton.style.display = 'none';
        logoutButton.style.display = 'block';
        console.log('User is logged in.');
      } else {
        loginButton.style.display = 'block';
        logoutButton.style.display = 'none';
        console.log('User is not logged in.');
      }
    })
    .catch((error) => console.error('Error checking auth status:', error));
}
