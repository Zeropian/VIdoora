// ===== THEME TOGGLE =====
const themeToggle = document.getElementById('theme-toggle');
const htmlRoot = document.getElementById('html-root');

// Check saved theme or OS preference
const savedTheme = localStorage.getItem('vidora-theme');
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
  htmlRoot.setAttribute('data-theme', 'dark');
  themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
} else {
  htmlRoot.setAttribute('data-theme', 'light');
  themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
}

themeToggle.addEventListener('click', () => {
  const currentTheme = htmlRoot.getAttribute('data-theme');
  if (currentTheme === 'dark') {
    htmlRoot.setAttribute('data-theme', 'light');
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    localStorage.setItem('vidora-theme', 'light');
  } else {
    htmlRoot.setAttribute('data-theme', 'dark');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    localStorage.setItem('vidora-theme', 'dark');
  }
});

// ===== SIDEBAR TOGGLE =====
const hamburger = document.getElementById('hamburger');
const mobileSidebar = document.getElementById('mobile-sidebar');
const closeBtn = document.getElementById('close-sidebar');
const overlay = document.getElementById('overlay');

function openMobileSidebar() {
  mobileSidebar.classList.add('active');
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeMobileSidebar() {
  mobileSidebar.classList.remove('active');
  overlay.classList.remove('active');
  document.body.style.overflow = '';
}

hamburger?.addEventListener('click', openMobileSidebar);
closeBtn?.addEventListener('click', closeMobileSidebar);
overlay?.addEventListener('click', closeMobileSidebar);

// Close mobile sidebar on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && mobileSidebar?.classList.contains('active')) {
    closeMobileSidebar();
  }
});

// ===== DESKTOP SIDEBAR EXPAND/COLLAPSE =====
const desktopSidebar = document.getElementById('desktop-sidebar');
const sidebarToggle = document.getElementById('sidebar-toggle');

// Check saved sidebar state
const savedSidebarState = localStorage.getItem('vidora-sidebar-expanded');

if (savedSidebarState === 'true') {
  desktopSidebar?.classList.add('expanded');
  document.body.classList.add('sidebar-expanded');
} else {
  desktopSidebar?.classList.remove('expanded');
  document.body.classList.remove('sidebar-expanded');
}

sidebarToggle?.addEventListener('click', () => {
  const isExpanded = desktopSidebar?.classList.contains('expanded');
  
  if (isExpanded) {
    desktopSidebar.classList.remove('expanded');
    document.body.classList.remove('sidebar-expanded');
    localStorage.setItem('vidora-sidebar-expanded', 'false');
  } else {
    desktopSidebar.classList.add('expanded');
    document.body.classList.add('sidebar-expanded');
    localStorage.setItem('vidora-sidebar-expanded', 'true');
  }
});

// ===== AUTHENTICATION STATE MANAGEMENT =====
async function updateAuthUI() {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  const headerRight = document.querySelector('.header-right');
  
  if (!headerRight) return;
  
  if (token && user.email) {
    // User is authenticated - show user menu
    const firstLetter = (user.name || user.email).charAt(0).toUpperCase();
    
    // Remove sign in/up buttons if they exist
    const signInBtn = headerRight.querySelector('a[href="signin.html"]');
    const signUpBtn = headerRight.querySelector('a[href="signup.html"]');
    if (signInBtn) signInBtn.remove();
    if (signUpBtn) signUpBtn.remove();
    
    // Remove any existing user menu
    const existingUserMenu = headerRight.querySelector('.user-menu');
    if (existingUserMenu) {
      existingUserMenu.remove();
    }
    
    // Create new user menu
    const userMenu = document.createElement('div');
    userMenu.className = 'user-menu';
    userMenu.innerHTML = `
      <button class="user-avatar" id="user-avatar">
        <span>${firstLetter}</span>
      </button>
      <div class="user-dropdown" id="user-dropdown">
        <div class="user-info">
          <div class="user-avatar-dropdown">
            <span>${firstLetter}</span>
          </div>
          <div class="user-details">
            <div class="user-name">${user.name || 'User'}</div>
            <div class="user-email">${user.email}</div>
          </div>
        </div>
        <div class="dropdown-divider"></div>
        <a href="#" class="dropdown-item">
          <i class="fas fa-user"></i>
          Your Channel
        </a>
        <a href="upload.html" class="dropdown-item">
          <i class="fas fa-upload"></i>
          Upload Video
        </a>
        <a href="#" class="dropdown-item">
          <i class="fas fa-play-circle"></i>
          Your Videos
        </a>
        <a href="watch-history.html" class="dropdown-item">
          <i class="fas fa-history"></i>
          Watch History
        </a>
        <a href="liked-videos.html" class="dropdown-item">
          <i class="fas fa-thumbs-up"></i>
          Liked Videos
        </a>
        <div class="dropdown-divider"></div>
        <a href="#" class="dropdown-item">
          <i class="fas fa-cog"></i>
          Settings
        </a>
        <div class="dropdown-divider"></div>
        <a href="#" class="dropdown-item" id="logout-btn">
          <i class="fas fa-sign-out-alt"></i>
          Sign Out
        </a>
      </div>
    `;
    
    headerRight.appendChild(userMenu);
    
    // Add event listeners for dropdown
    const userAvatar = userMenu.querySelector('.user-avatar');
    const userDropdown = userMenu.querySelector('.user-dropdown');
    const logoutBtn = userMenu.querySelector('#logout-btn');
    
    userAvatar.addEventListener('click', (e) => {
      e.stopPropagation();
      userDropdown.classList.toggle('active');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!userMenu.contains(e.target)) {
        userDropdown.classList.remove('active');
      }
    });
    
    // Logout functionality - UPDATED FOR API
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Use API service if available, otherwise fallback to localStorage
      if (window.apiService && typeof window.apiService.clearToken === 'function') {
        window.apiService.clearToken();
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
      
      // Clear all auth-related data
      localStorage.removeItem('userAuthenticated');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userName');
      
      // Redirect to home page
      window.location.href = 'index.html';
    });
    
  } else {
    // User is not authenticated - show sign in/up buttons
    const userMenu = headerRight.querySelector('.user-menu');
    if (userMenu) userMenu.remove();
    
    // Remove any existing auth buttons
    const existingAuthBtns = headerRight.querySelectorAll('.btn-outline, .btn-primary');
    existingAuthBtns.forEach(btn => {
      if (btn.textContent.includes('Sign In') || btn.textContent.includes('Sign Up')) {
        btn.remove();
      }
    });
    
    // Add sign in/up buttons if they don't exist
    if (!headerRight.querySelector('a[href="signin.html"]')) {
      const signInBtn = document.createElement('a');
      signInBtn.href = 'signin.html';
      signInBtn.className = 'btn btn-outline';
      signInBtn.textContent = 'Sign In';
      headerRight.appendChild(signInBtn);
    }
    
    if (!headerRight.querySelector('a[href="signup.html"]')) {
      const signUpBtn = document.createElement('a');
      signUpBtn.href = 'signup.html';
      signUpBtn.className = 'btn btn-primary';
      signUpBtn.textContent = 'Sign Up';
      headerRight.appendChild(signUpBtn);
    }
  }
}

// ===== HOME PAGE CONTENT MANAGEMENT =====
async function updateHomeContent() {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  const welcomeSection = document.querySelector('.welcome-section');
  const welcomeActions = document.querySelector('.welcome-actions');
  const emptyVideoGrid = document.querySelector('.empty-video-grid');
  const createBtn = document.getElementById('create-btn');
  
  if (token && user.email) {
    // User is authenticated
    if (welcomeActions) {
      welcomeActions.style.display = 'none';
    }
    
    // Update create button to go directly to upload
    if (createBtn) {
      createBtn.href = 'upload.html';
    }
    
    // Load videos from API
    await loadVideos();
  } else {
    // User is not authenticated
    if (welcomeActions) {
      welcomeActions.style.display = 'flex';
    }
    
    // Update create button to go to signin
    if (createBtn) {
      createBtn.href = 'signin.html?redirect=upload';
    }
    
    // Show empty video grid for non-authenticated users
    const emptyVideoGrid = document.querySelector('.empty-video-grid');
    const videosGrid = document.querySelector('.videos-grid');
    
    if (emptyVideoGrid) {
      emptyVideoGrid.style.display = 'block';
    }
    if (videosGrid) {
      videosGrid.style.display = 'none';
    }
  }
}

// Load videos for authenticated users from API
async function loadVideos() {
  const emptyVideoGrid = document.querySelector('.empty-video-grid');
  const emptyState = document.querySelector('.empty-state');
  const videosGrid = document.querySelector('.videos-grid');
  
  try {
    // Use API service to fetch videos
    let videos = [];
    
    if (window.apiService && typeof window.apiService.getVideos === 'function') {
      videos = await window.apiService.getVideos();
    } else {
      // Fallback: try direct fetch
      const token = localStorage.getItem('token');
      const response = await fetch(`${window.APP_CONFIG?.apiBaseUrl || '/api'}/videos`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        videos = await response.json();
      }
    }
    
    if (videos.length > 0) {
      // Hide empty state and show videos grid
      if (emptyVideoGrid) {
        emptyVideoGrid.style.display = 'none';
      }
      if (videosGrid) {
        videosGrid.style.display = 'grid';
        renderVideos(videos);
      }
    } else {
      // No videos - show empty state with upload button
      if (emptyVideoGrid) {
        emptyVideoGrid.style.display = 'block';
      }
      if (videosGrid) {
        videosGrid.style.display = 'none';
      }
      if (emptyState) {
        const uploadBtn = emptyState.querySelector('.btn');
        if (uploadBtn) {
          uploadBtn.innerHTML = '<i class="fas fa-plus"></i> Upload Your First Video';
          uploadBtn.onclick = () => {
            window.location.href = 'upload.html';
          };
        }
      }
    }
  } catch (error) {
    console.error('Error loading videos:', error);
    
    // Show empty state on error
    if (emptyVideoGrid) {
      emptyVideoGrid.style.display = 'block';
    }
    if (videosGrid) {
      videosGrid.style.display = 'none';
    }
  }
}

// Render videos in the grid
function renderVideos(videos) {
  const videosGrid = document.querySelector('.videos-grid');
  if (!videosGrid) return;
  
  videosGrid.innerHTML = '';
  
  videos.forEach(video => {
    const videoCard = document.createElement('div');
    videoCard.className = 'video-card';
    videoCard.innerHTML = `
      <div class="video-thumbnail">
        <img src="${video.thumbnail_url || 'https://via.placeholder.com/320x180/ff3b30/ffffff?text=No+Thumbnail'}" alt="${video.title}" />
        <span class="video-duration">${video.duration || '10:00'}</span>
      </div>
      <div class="video-info">
        <div class="video-channel-avatar">${video.users?.name?.charAt(0) || 'U'}</div>
        <div class="video-details">
          <h3 class="video-title">${video.title}</h3>
          <p class="video-channel-name">${video.users?.name || 'Unknown Channel'}</p>
          <p class="video-meta">${video.views || 0} views • ${formatTimeAgo(video.created_at)}</p>
        </div>
      </div>
    `;
    
    // Add click event to play video
    videoCard.addEventListener('click', () => {
      // In real implementation: window.location.href = `watch.html?v=${video.id}`;
      alert(`Playing: ${video.title}`);
    });
    
    videosGrid.appendChild(videoCard);
  });
}

// Format time ago for video timestamps
function formatTimeAgo(dateString) {
  if (!dateString) return 'Recently';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) {
    return '1 day ago';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} month${months > 1 ? 's' : ''} ago`;
  } else {
    const years = Math.floor(diffDays / 365);
    return `${years} year${years > 1 ? 's' : ''} ago`;
  }
}

// ===== SEARCH FUNCTIONALITY =====
const searchInput = document.querySelector('.search-input');
const searchBtn = document.querySelector('.search-btn');

if (searchInput && searchBtn) {
  // Add search icon to the left of search input if not present
  if (!document.querySelector('.search-icon')) {
    const searchIcon = document.createElement('i');
    searchIcon.className = 'fas fa-search search-icon';
    searchInput.parentNode.insertBefore(searchIcon, searchInput);
  }

  // Search functionality
  searchBtn.addEventListener('click', performSearch);
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      performSearch();
    }
  });

  function performSearch() {
    const query = searchInput.value.trim();
    if (query) {
      // For now, just show alert. In future, implement search API
      alert(`Searching for: ${query}`);
      // Future implementation: 
      // window.location.href = `search.html?q=${encodeURIComponent(query)}`;
    } else {
      searchInput.focus();
    }
  }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
  // Initialize authentication UI
  updateAuthUI();
  updateHomeContent();
  
  // Check if user needs to be redirected based on authentication
  const token = localStorage.getItem('token');
  const currentPage = window.location.pathname;
  
  // Redirect logic for protected pages
  if (!token) {
    const protectedPages = ['upload.html', 'watch-history.html', 'liked-videos.html'];
    const isProtectedPage = protectedPages.some(page => currentPage.includes(page));
    
    if (isProtectedPage) {
      window.location.href = `signin.html?redirect=${currentPage.split('.')[0]}`;
      return;
    }
  }
  
  // Display user info in sidebar if available
  const userEmail = localStorage.getItem('userEmail');
  const userFromStorage = JSON.parse(localStorage.getItem('user') || '{}');
  const userAvatar = document.getElementById('user-avatar');
  
  if ((userEmail || userFromStorage.email) && userAvatar) {
    const firstLetter = (userFromStorage.name || userEmail).charAt(0).toUpperCase();
    userAvatar.innerHTML = `<span>${firstLetter}</span>`;
  }
});

// ===== GLOBAL FUNCTIONS FOR OTHER PAGES =====

// Function to check authentication on other pages
window.checkAuthentication = function() {
  const token = localStorage.getItem('token');
  if (!token) {
    const currentPage = window.location.pathname.split('/').pop();
    window.location.href = `signin.html?redirect=${currentPage.split('.')[0]}`;
    return false;
  }
  return true;
};

// Function to get current user info
window.getCurrentUser = function() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');
  
  return {
    ...user,
    token
  };
};

// Function to handle API errors
window.handleApiError = function(error) {
  console.error('API Error:', error);
  
  if (error.message === 'Session expired' || error.message.includes('token')) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'signin.html';
    return;
  }
  
  // Show error to user (you can customize this)
  alert(`Error: ${error.message}`);
};

// Export for module usage (if needed)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    updateAuthUI,
    updateHomeContent,
    loadVideos,
    checkAuthentication: window.checkAuthentication,
    getCurrentUser: window.getCurrentUser,
    handleApiError: window.handleApiError
  };
}