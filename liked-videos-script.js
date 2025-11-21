// [filename].js - Clean version

// Theme + Mobile Sidebar only (same code as upload-script.js top part)
const themeToggle = document.getElementById('theme-toggle');
const htmlRoot = document.getElementById('html-root');
const savedTheme = localStorage.getItem('vidora-theme');
if (savedTheme) htmlRoot.setAttribute('data-theme', savedTheme);
themeToggle.innerHTML = savedTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';

themeToggle.addEventListener('click', () => {
  const isDark = htmlRoot.getAttribute('data-theme') === 'dark';
  htmlRoot.setAttribute('data-theme', isDark ? 'light' : 'dark');
  themeToggle.innerHTML = isDark ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
  localStorage.setItem('vidora-theme', isDark ? 'light' : 'dark');
});

// Mobile sidebar
const hamburger = document.getElementById('hamburger');
const mobileSidebar = document.getElementById('mobile-sidebar');
const overlay = document.getElementById('overlay');

hamburger?.addEventListener('click', () => {
  mobileSidebar?.classList.add('active');
  overlay?.classList.add('active');
  document.body.style.overflow = 'hidden';
});

overlay?.addEventListener('click', () => {
  mobileSidebar?.classList.remove('active');
  overlay?.classList.remove('active');
  document.body.style.overflow = '';
});

// Page will stay empty until backend sends real data
document.addEventListener('DOMContentLoaded', () => {
  console.log('Page ready - waiting for backend data');
});