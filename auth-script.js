// auth-script.js - UPDATED VERSION

// Apply theme on auth pages
const htmlRoot = document.getElementById('html-root');
const savedTheme = localStorage.getItem('vidora-theme');
if (savedTheme) {
  htmlRoot.setAttribute('data-theme', savedTheme);
}

// Password visibility toggle
document.querySelectorAll('.password-toggle').forEach(toggle => {
  toggle.addEventListener('click', function() {
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

// Enhanced form validation
function showError(fieldId, message) {
  const field = document.getElementById(fieldId);
  field.style.borderColor = '#ff3b30';
  
  let errorElement = field.parentNode.querySelector('.error-message');
  if (!errorElement) {
    errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    field.parentNode.appendChild(errorElement);
  }
  errorElement.textContent = message;
  errorElement.style.color = '#ff3b30';
  errorElement.style.fontSize = '0.875rem';
  errorElement.style.marginTop = '0.25rem';
}

function clearErrors() {
  document.querySelectorAll('.error-message').forEach(el => el.remove());
  document.querySelectorAll('input').forEach(input => {
    input.style.borderColor = '';
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Show loading state
function setLoading(button, isLoading) {
  if (isLoading) {
    button.disabled = true;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
  } else {
    button.disabled = false;
    button.innerHTML = button.getAttribute('data-original-text');
  }
}

// Sign Up Form - UPDATED FOR BACKEND
document.getElementById('signup-form')?.addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('signup-email').value.trim();
  const password = document.getElementById('signup-password').value;
  const confirmPassword = document.getElementById('confirm-password').value;
  const submitButton = this.querySelector('button[type="submit"]');
  
  // Save original button text
  submitButton.setAttribute('data-original-text', submitButton.innerHTML);
  
  clearErrors();
  
  let isValid = true;
  
  if (name.length < 2) {
    showError('name', 'Name must be at least 2 characters');
    isValid = false;
  }
  
  if (!isValidEmail(email)) {
    showError('signup-email', 'Please enter a valid email address');
    isValid = false;
  }
  
  if (password.length < 6) {
    showError('signup-password', 'Password must be at least 6 characters');
    isValid = false;
  }
  
  if (password !== confirmPassword) {
    showError('confirm-password', 'Passwords do not match');
    isValid = false;
  }
  
  if (isValid) {
    setLoading(submitButton, true);
    
    try {
      // Use the API service instead of localStorage
      const result = await window.apiService.register({
        name,
        email,
        password
      });
      
      // Store token and user data
      window.apiService.setToken(result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
      
      // Success message
      alert('Account created successfully!');
      
      // Check if there's a redirect parameter
      const urlParams = new URLSearchParams(window.location.search);
      const redirect = urlParams.get('redirect');
      
      if (redirect === 'upload') {
        window.location.href = 'upload.html';
      } else {
        window.location.href = 'index.html';
      }
      
    } catch (error) {
      showError('signup-email', error.message || 'Registration failed');
    } finally {
      setLoading(submitButton, false);
    }
  }
});

// Sign In Form - UPDATED FOR BACKEND
document.getElementById('signin-form')?.addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const submitButton = this.querySelector('button[type="submit"]');
  
  // Save original button text
  submitButton.setAttribute('data-original-text', submitButton.innerHTML);
  
  clearErrors();
  
  let isValid = true;
  
  if (!isValidEmail(email)) {
    showError('email', 'Please enter a valid email address');
    isValid = false;
  }
  
  if (password.length < 6) {
    showError('password', 'Password must be at least 6 characters');
    isValid = false;
  }
  
  if (isValid) {
    setLoading(submitButton, true);
    
    try {
      // Use the API service instead of localStorage
      const result = await window.apiService.login({
        email,
        password
      });
      
      // Store token and user data
      window.apiService.setToken(result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
      
      // Success message
      alert('Login successful!');
      
      // Check if there's a redirect parameter
      const urlParams = new URLSearchParams(window.location.search);
      const redirect = urlParams.get('redirect');
      
      if (redirect === 'upload') {
        window.location.href = 'upload.html';
      } else {
        window.location.href = 'index.html';
      }
      
    } catch (error) {
      showError('email', error.message || 'Login failed');
    } finally {
      setLoading(submitButton, false);
    }
  }
});

// Check if user is already authenticated and redirect
document.addEventListener('DOMContentLoaded', function() {
  const token = localStorage.getItem('token');
  const currentPage = window.location.pathname;
  
  if (token && (currentPage.includes('signin.html') || currentPage.includes('signup.html'))) {
    const urlParams = new URLSearchParams(window.location.search);
    const redirect = urlParams.get('redirect');
    
    if (redirect === 'upload') {
      window.location.href = 'upload.html';
    } else {
      window.location.href = 'index.html';
    }
  }
});