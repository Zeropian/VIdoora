// auth-script.js - Ready for real backend (no fake login)

const htmlRoot = document.getElementById('html-root');
const savedTheme = localStorage.getItem('vidora-theme');
if (savedTheme) {
  htmlRoot.setAttribute('data-theme', savedTheme);
}

// Password visibility toggle
document.querySelectorAll('.password-toggle').forEach(toggle => {
  toggle.addEventListener('click', function () {
    const input = this.parentElement.querySelector('input');
    const icon = this.querySelector('i');
    if (input.type === 'password') {
      input.type = 'text';
      icon.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
      input.type = 'password';
      icon.classList.replace('fa-eye-slash', 'fa-eye');
    }
  });
});

// Validation helpers
function showError(fieldId, message) {
  const field = document.getElementById(fieldId);
  if (!field) return;
  field.style.borderColor = '#ff3b30';
  let error = field.parentNode.querySelector('.error-message');
  if (!error) {
    error = document.createElement('div');
    error.className = 'error-message';
    field.parentNode.appendChild(error);
  }
  error.textContent = message;
}

function clearErrors() {
  document.querySelectorAll('.error-message').forEach(el => el.remove());
  document.querySelectorAll('input').forEach(input => input.style.borderColor = '');
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Sign Up
document.getElementById('signup-form')?.addEventListener('submit', async function (e) {
  e.preventDefault();
  clearErrors();

  const name = document.getElementById('name')?.value.trim();
  const email = document.getElementById('signup-email')?.value.trim();
  const password = document.getElementById('signup-password')?.value;
  const confirm = document.getElementById('confirm-password')?.value;

  let valid = true;

  if (!name || name.length < 2) { showError('name', 'Name too short'); valid = false; }
  if (!isValidEmail(email)) { showError('signup-email', 'Invalid email'); valid = false; }
  if (password.length < 6) { showError('signup-password', 'Password too short'); valid = false; }
  if (password !== confirm) { showError('confirm-password', 'Passwords do not match'); valid = false; }

  if (valid) {
    // ←←← BACKEND TEAM WILL PUT REAL API HERE →→
    // await fetch('/api/auth/signup', { method: 'POST', body: JSON.stringify({name, email, password}) })
    alert('Sign Up clicked – waiting for backend API');
  }
});

// Sign In
document.getElementById('signin-form')?.addEventListener('submit', async function (e) {
  e.preventDefault();
  clearErrors();

  const email = document.getElementById('email')?.value.trim();
  const password = document.getElementById('password')?.value;

  let valid = true;
  if (!isValidEmail(email)) { showError('email', 'Invalid email'); valid = false; }
  if (password.length < 6) { showError('password', 'Password too short'); valid = false; }

  if (valid) {
    // ←←← BACKEND TEAM WILL PUT REAL API HERE →→
    // await fetch('/api/auth/login', { method: 'POST', body: JSON.stringify({email, password}) })
    alert('Sign In clicked – waiting for backend API');
  }
});