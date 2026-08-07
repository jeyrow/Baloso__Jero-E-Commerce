const togglePassword = document.getElementById('togglePassword');
const passwordField = document.getElementById('password');

togglePassword.addEventListener('click', () => {
  if (passwordField.type === 'password') {
    passwordField.type = 'text';
    togglePassword.textContent = 'Hide';
  } else {
    passwordField.type = 'password';
    togglePassword.textContent = 'Show';
  }
});


const form = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');

const usernameError = document.getElementById('usernameError');
const passwordError = document.getElementById('passwordError');
const messageDiv = document.getElementById('message');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  
  
  usernameError.textContent = '';
  passwordError.textContent = '';
  messageDiv.textContent = '';

  let valid = true;

  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  
  if (username === '') {
    usernameError.textContent = 'Please enter your email or username.';
    valid = false;
  }

  if (password === '') {
    passwordError.textContent = 'Please enter your password.';
    valid = false;
  }

  if (!valid) return;

  
  if (username === 'jeroyeah' && password === 'ilovemywife') {
    messageDiv.style.color = 'green';
    messageDiv.textContent = 'Login successful!';

  
  } else {
    messageDiv.style.color = 'red';
    messageDiv.textContent = 'Invalid username or password.';
  }
});
