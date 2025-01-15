document.getElementById('signup-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      alert('Registration successful! Please log in.');
      window.location.href = '/'; // Redirect to the homepage
    } else {
      const errorData = await response.json();
      showError(`Error: ${errorData.error}`);
    }
  } catch (error) {
    showError('An unexpected error occurred.');
  }
});

function showError(message) {
  alert(message);
}
