// script.js - CLEAN VERSION (no fake auth)

const themeToggle = document.getElementById('theme-toggle');
const htmlRoot = document.getElementById('html-root');

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

// Sidebar toggle logic (hamburger, overlay, etc.)
const hamburger = document.getElementById('hamburger');
const mobileSidebar = document.getElementById('mobile-sidebar');
const overlay = document.getElementById('overlay');

function openMobileSidebar() {
  mobileSidebar?.classList.add('active');
  overlay?.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeMobileSidebar() {
  mobileSidebar?.classList.remove('active');
  overlay?.classList.remove('active');
  document.body.style.overflow = '';
}

hamburger?.addEventListener('click', openMobileSidebar);
overlay?.addEventListener('click', closeMobileSidebar);

// Update Auth UI - backend will control this
function updateAuthUI() {
  // Backend team: call your /api/me or check token here
  // For now, assume user is NOT logged in
  const userMenu = document.querySelector('.user-menu');
  if (userMenu) {
    userMenu.innerHTML = `
      <a href="signin.html" class="btn btn-outline">Sign In</a>
      <a href="signup.html" class="btn btn-primary">Sign Up</a>
    `;
  }
}

// Home content - will be filled by backend API later
function updateHomeContent() {
  const videosGrid = document.getElementById('videos-grid');
  const emptyState = document.querySelector('.empty-video-grid');

  // TODO: Backend - fetch real videos and call renderVideos(data)
  if (videosGrid) videosGrid.style.display = 'none';
  if (emptyState) emptyState.style.display = 'block';
}

function renderVideos(videos) {
  const videosGrid = document.querySelector('.videos-grid');
  if (!videosGrid) return;
  videosGrid.innerHTML = '';
  // same rendering code as before...
}

// Search placeholder
document.querySelector('.search-btn')?.addEventListener('click', () => {
  const query = document.querySelector('.search-input')?.value.trim();
  if (query) alert(`Search: ${query}`); // TODO: real search page
});