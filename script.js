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
function updateAuthUI() {
  const isAuthenticated = localStorage.getItem('userAuthenticated') === 'true';
  const userEmail = localStorage.getItem('userEmail');
  const userName = localStorage.getItem('userName');
  const headerRight = document.querySelector('.header-right');
  
  if (!headerRight) return;
  
  if (isAuthenticated && userEmail) {
    // User is authenticated - show user menu
    const firstLetter = (userName || userEmail).charAt(0).toUpperCase();
    
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
            <div class="user-name">${userName || 'User'}</div>
            <div class="user-email">${userEmail}</div>
          </div>
        </div>
        <div class="dropdown-divider"></div>
        <a href="#" class="dropdown-item">
          <i class="fas fa-user"></i>
          Your Channel
        </a>
        <a href="#" class="dropdown-item">
          <i class="fas fa-play-circle"></i>
          Your Videos
        </a>
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
    
    // Logout functionality
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('userAuthenticated');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userName');
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
function updateHomeContent() {
  const isAuthenticated = localStorage.getItem('userAuthenticated') === 'true';
  const welcomeSection = document.querySelector('.welcome-section');
  const welcomeActions = document.querySelector('.welcome-actions');
  const emptyVideoGrid = document.querySelector('.empty-video-grid');
  const createBtn = document.getElementById('create-btn');
  
  if (isAuthenticated) {
    // User is authenticated
    if (welcomeActions) {
      welcomeActions.style.display = 'none';
    }
    
    // Update create button to go directly to upload
    if (createBtn) {
      createBtn.href = 'upload.html';
    }
    
    // Load videos if available
    loadVideos();
  } else {
    // User is not authenticated
    if (welcomeActions) {
      welcomeActions.style.display = 'flex';
    }
    
    // Update create button to go to signin
    if (createBtn) {
      createBtn.href = 'signin.html?redirect=upload';
    }
  }
}

// Load videos for authenticated users
function loadVideos() {
  const emptyVideoGrid = document.querySelector('.empty-video-grid');
  const emptyState = document.querySelector('.empty-state');
  const videosGrid = document.querySelector('.videos-grid');
  
  // Check if there are any videos in localStorage
  const savedVideos = localStorage.getItem('vidora-videos');
  const videos = savedVideos ? JSON.parse(savedVideos) : [];
  
  if (videos.length > 0) {
    // Hide empty state and show videos grid
    if (emptyVideoGrid) {
      emptyVideoGrid.style.display = 'none';
    }
    if (videosGrid) {
      videosGrid.style.display = 'grid';
      // Render videos here
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
        <img src="${video.thumbnail}" alt="${video.title}" />
        <span class="video-duration">${video.duration}</span>
      </div>
      <div class="video-info">
        <div class="video-channel-avatar">${video.channelAvatar}</div>
        <div class="video-details">
          <h3 class="video-title">${video.title}</h3>
          <p class="video-channel-name">${video.channel}</p>
          <p class="video-meta">${video.views} • ${video.timestamp}</p>
        </div>
      </div>
    `;
    
    videosGrid.appendChild(videoCard);
  });
}

// Initialize authentication UI and home content on page load
document.addEventListener('DOMContentLoaded', function() {
  updateAuthUI();
  updateHomeContent();
});

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
      alert(`Searching for: ${query}`);
      // Future implementation: Redirect to search results
      // window.location.href = `search.html?q=${encodeURIComponent(query)}`;
    } else {
      searchInput.focus();
    }
  }
}