// auth-script.js - UPDATED FOR BACKEND API INTEGRATION

// ===== CONFIGURATION =====
// Check if we're in development or production
const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_BASE_URL = isDevelopment 
  ? 'http://localhost:3000/api' 
  : 'https://vidoorabackend-git-main-dr-ks-projects.vercel.app/'; // Replace with your actual Vercel URL

// ===== THEME MANAGEMENT =====
const htmlRoot = document.getElementById('html-root');
const savedTheme = localStorage.getItem('vidora-theme');
if (savedTheme) {
  htmlRoot.setAttribute('data-theme', savedTheme);
}

// ===== PASSWORD VISIBILITY TOGGLE =====
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

// ===== FORM VALIDATION UTILITIES =====
function showError(fieldId, message) {
  const field = document.getElementById(fieldId);
  if (!field) return;
  
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

// ===== LOADING STATE MANAGEMENT =====
function setLoading(button, isLoading) {
  if (isLoading) {
    button.disabled = true;
    const originalText = button.innerHTML;
    button.setAttribute('data-original-text', originalText);
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
  } else {
    button.disabled = false;
    const originalText = button.getAttribute('data-original-text');
    if (originalText) {
      button.innerHTML = originalText;
    }
  }
}

// ===== API SERVICE FUNCTIONS =====
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  const config = {
    ...options,
    headers
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

async function registerUser(userData) {
  return apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData)
  });
}

async function loginUser(credentials) {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  });
}

// ===== AUTHENTICATION MANAGEMENT =====
function storeAuthData(token, user) {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
  
  // Also set the old format for compatibility with existing code
  localStorage.setItem('userAuthenticated', 'true');
  localStorage.setItem('userEmail', user.email);
  localStorage.setItem('userName', user.name);
}

function clearAuthData() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('userAuthenticated');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userName');
}

function redirectAfterAuth() {
  const urlParams = new URLSearchParams(window.location.search);
  const redirect = urlParams.get('redirect');
  
  if (redirect === 'upload') {
    window.location.href = 'upload.html';
  } else {
    window.location.href = 'index.html';
  }
}

// ===== SIGN UP FORM HANDLER =====
document.getElementById('signup-form')?.addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('signup-email').value.trim();
  const password = document.getElementById('signup-password').value;
  const confirmPassword = document.getElementById('confirm-password').value;
  const submitButton = this.querySelector('button[type="submit"]');
  
  clearErrors();
  
  let isValid = true;
  
  // Validation
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
      console.log('Attempting registration...');
      
      const result = await registerUser({
        name,
        email,
        password
      });
      
      console.log('Registration successful:', result);
      
      // Store authentication data
      storeAuthData(result.token, result.user);
      
      // Show success message
      showSuccessMessage('Account created successfully!');
      
      // Redirect after a short delay
      setTimeout(() => {
        redirectAfterAuth();
      }, 1500);
      
    } catch (error) {
      console.error('Registration error:', error);
      
      // Show appropriate error message
      if (error.message.includes('User already exists')) {
        showError('signup-email', 'An account with this email already exists');
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        showError('signup-email', 'Network error. Please check your connection and try again.');
      } else {
        showError('signup-email', error.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(submitButton, false);
    }
  }
});

// ===== SIGN IN FORM HANDLER =====
document.getElementById('signin-form')?.addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const submitButton = this.querySelector('button[type="submit"]');
  
  clearErrors();
  
  let isValid = true;
  
  // Validation
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
      console.log('Attempting login...');
      
      const result = await loginUser({
        email,
        password
      });
      
      console.log('Login successful:', result);
      
      // Store authentication data
      storeAuthData(result.token, result.user);
      
      // Show success message
      showSuccessMessage('Login successful!');
      
      // Redirect after a short delay
      setTimeout(() => {
        redirectAfterAuth();
      }, 1500);
      
    } catch (error) {
      console.error('Login error:', error);
      
      // Show appropriate error message
      if (error.message.includes('Invalid credentials') || error.message.includes('401')) {
        showError('email', 'Invalid email or password');
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        showError('email', 'Network error. Please check your connection and try again.');
      } else {
        showError('email', error.message || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(submitButton, false);
    }
  }
});

// ===== SUCCESS MESSAGE DISPLAY =====
function showSuccessMessage(message) {
  // Create success message element
  const successElement = document.createElement('div');
  successElement.className = 'success-message';
  successElement.innerHTML = `
    <div style="
      background: #4CAF50;
      color: white;
      padding: 12px 16px;
      border-radius: 8px;
      margin: 16px 0;
      display: flex;
      align-items: center;
      gap: 8px;
      animation: fadeIn 0.3s ease-in;
    ">
      <i class="fas fa-check-circle"></i>
      <span>${message}</span>
    </div>
  `;
  
  // Add styles for animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);
  
  // Insert after the form
  const form = document.querySelector('form');
  if (form) {
    form.parentNode.insertBefore(successElement, form.nextSibling);
  }
  
  // Remove after 3 seconds
  setTimeout(() => {
    successElement.remove();
  }, 3000);
}

// ===== AUTO-REDIRECT FOR AUTHENTICATED USERS =====
document.addEventListener('DOMContentLoaded', function() {
  const token = localStorage.getItem('token');
  const currentPage = window.location.pathname;
  
  // If user is already authenticated and on auth pages, redirect to home
  if (token && (currentPage.includes('signin.html') || currentPage.includes('signup.html'))) {
    console.log('User already authenticated, redirecting...');
    
    // Show loading message
    const mainContent = document.querySelector('.auth-card') || document.querySelector('main');
    if (mainContent) {
      mainContent.innerHTML = `
        <div style="text-align: center; padding: 2rem;">
          <i class="fas fa-spinner fa-spin fa-2x" style="color: var(--primary-color); margin-bottom: 1rem;"></i>
          <p>You are already signed in. Redirecting...</p>
        </div>
      `;
    }
    
    // Redirect after short delay
    setTimeout(() => {
      redirectAfterAuth();
    }, 1000);
  }
  
  // Enhance form UX with real-time validation
  enhanceFormUX();
});

// ===== ENHANCED FORM UX =====
function enhanceFormUX() {
  // Real-time email validation
  const emailInputs = document.querySelectorAll('input[type="email"]');
  emailInputs.forEach(input => {
    input.addEventListener('blur', function() {
      if (this.value.trim() && !isValidEmail(this.value.trim())) {
        showError(this.id, 'Please enter a valid email address');
      }
    });
  });
  
  // Real-time password confirmation
  const confirmPasswordInput = document.getElementById('confirm-password');
  const passwordInput = document.getElementById('signup-password');
  
  if (confirmPasswordInput && passwordInput) {
    confirmPasswordInput.addEventListener('blur', function() {
      if (this.value && passwordInput.value && this.value !== passwordInput.value) {
        showError('confirm-password', 'Passwords do not match');
      }
    });
    
    passwordInput.addEventListener('input', function() {
      if (confirmPasswordInput.value && this.value !== confirmPasswordInput.value) {
        showError('confirm-password', 'Passwords do not match');
      } else {
        clearErrors();
      }
    });
  }
  
  // Enter key to submit forms
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('keypress', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        const submitButton = this.querySelector('button[type="submit"]');
        if (submitButton && !submitButton.disabled) {
          submitButton.click();
        }
      }
    });
  });
}

// ===== PASSWORD STRENGTH INDICATOR =====
document.getElementById('signup-password')?.addEventListener('input', function() {
  const password = this.value;
  const strengthIndicator = document.getElementById('password-strength') || createPasswordStrengthIndicator();
  
  if (password.length === 0) {
    strengthIndicator.style.display = 'none';
    return;
  }
  
  strengthIndicator.style.display = 'block';
  
  let strength = 0;
  let feedback = '';
  
  if (password.length >= 8) strength++;
  if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
  if (password.match(/\d/)) strength++;
  if (password.match(/[^a-zA-Z\d]/)) strength++;
  
  switch (strength) {
    case 0:
    case 1:
      feedback = 'Weak';
      strengthIndicator.style.color = '#ff3b30';
      break;
    case 2:
      feedback = 'Fair';
      strengthIndicator.style.color = '#ff9500';
      break;
    case 3:
      feedback = 'Good';
      strengthIndicator.style.color = '#ffcc00';
      break;
    case 4:
      feedback = 'Strong';
      strengthIndicator.style.color = '#4CAF50';
      break;
  }
  
  strengthIndicator.textContent = `Password strength: ${feedback}`;
});

function createPasswordStrengthIndicator() {
  const strengthIndicator = document.createElement('div');
  strengthIndicator.id = 'password-strength';
  strengthIndicator.style.fontSize = '0.875rem';
  strengthIndicator.style.marginTop = '0.25rem';
  strengthIndicator.style.display = 'none';
  
  const passwordGroup = document.getElementById('signup-password')?.parentNode;
  if (passwordGroup) {
    passwordGroup.appendChild(strengthIndicator);
  }
  
  return strengthIndicator;
}

// ===== NETWORK STATUS CHECK =====
function checkNetworkStatus() {
  if (!navigator.onLine) {
    showNetworkError();
  }
  
  window.addEventListener('online', function() {
    hideNetworkError();
  });
  
  window.addEventListener('offline', function() {
    showNetworkError();
  });
}

function showNetworkError() {
  let networkError = document.getElementById('network-error');
  if (!networkError) {
    networkError = document.createElement('div');
    networkError.id = 'network-error';
    networkError.innerHTML = `
      <div style="
        background: #ff3b30;
        color: white;
        padding: 8px 12px;
        border-radius: 4px;
        margin: 8px 0;
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 0.875rem;
      ">
        <i class="fas fa-wifi"></i>
        <span>You are offline. Please check your connection.</span>
      </div>
    `;
    
    const authCard = document.querySelector('.auth-card');
    if (authCard) {
      authCard.insertBefore(networkError, authCard.firstChild);
    }
  }
}

function hideNetworkError() {
  const networkError = document.getElementById('network-error');
  if (networkError) {
    networkError.remove();
  }
}

// Initialize network status check
checkNetworkStatus();

// ===== EXPORT FOR MODULE USAGE =====
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    isValidEmail,
    showError,
    clearErrors,
    registerUser,
    loginUser,
    storeAuthData,
    clearAuthData
  };
}

// ===== GLOBAL ACCESS =====
window.authScript = {
  isValidEmail,
  showError,
  clearErrors,
  registerUser,
  loginUser,
  storeAuthData,
  clearAuthData
};

console.log('Auth script loaded successfully');