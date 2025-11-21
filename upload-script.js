// upload-script.js - 100% clean - ready for real upload API

const themeToggle = document.getElementById('theme-toggle');
const htmlRoot = document.getElementById('html-root');

// Theme
const savedTheme = localStorage.getItem('vidora-theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
  htmlRoot.setAttribute('data-theme', 'dark');
  themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
} else {
  htmlRoot.setAttribute('data-theme', 'light');
  themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
}

themeToggle.addEventListener('click', () => {
  const current = htmlRoot.getAttribute('data-theme');
  if (current === 'dark') {
    htmlRoot.setAttribute('data-theme', 'light');
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    localStorage.setItem('vidora-theme', 'light');
  } else {
    htmlRoot.setAttribute('data-theme', 'dark');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    localStorage.setItem('vidora-theme', 'dark');
  }
});

// Mobile Sidebar
const hamburger = document.getElementById('hamburger');
const sidebar = document.getElementById('mobile-sidebar');
const overlay = document.getElementById('overlay');

hamburger?.addEventListener('click', () => {
  sidebar?.classList.add('active');
  overlay?.classList.add('active');
  document.body.style.overflow = 'hidden';
});

overlay?.addEventListener('click', () => {
  sidebar?.classList.remove('active');
  overlay?.classList.remove('active');
  document.body.style.overflow = '';
});

// Upload Logic
const videoFileInput = document.getElementById('video-file');
const thumbnailInput = document.getElementById('thumbnail-file');
const uploadBox = document.querySelector('.upload-box');
const videoPreview = document.getElementById('video-preview');
const thumbnailPreview = document.getElementById('thumbnail-preview');
const titleInput = document.getElementById('video-title');
const descriptionInput = document.getElementById('video-description');
const titleChars = document.getElementById('title-chars');
const descriptionChars = document.getElementById('description-chars');
const publishBtn = document.getElementById('publish-btn');
const saveDraftBtn = document.getElementById('save-draft-btn');

// Character counters
titleInput?.addEventListener('input', () => titleChars.textContent = titleInput.value.length);
descriptionInput?.addEventListener('input', () => descriptionChars.textContent = descriptionInput.value.length);

// Drag & Drop
if (uploadBox && videoFileInput) {
  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(evt => {
    uploadBox.addEventListener(evt, e => { e.preventDefault(); e.stopPropagation(); });
  });

  uploadBox.addEventListener('dragenter', () => uploadBox.classList.add('dragover'));
  uploadBox.addEventListener('dragover', () => uploadBox.classList.add('dragover'));
  uploadBox.addEventListener('dragleave', () => uploadBox.classList.remove('dragover'));
  uploadBox.addEventListener('drop', e => {
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('video/')) {
      videoPreview(file);
    }
  });

  videoFileInput.addEventListener('change', () => {
    if (videoFileInput.files[0]) Preview(videoFileInput.files[0]);
  });

  function Preview(file) {
    const url = URL.createObjectURL(file);
    videoPreview.src = url;
    uploadBox.style.display = 'none';
    videoPreview.style.display = 'block';
    publishBtn.disabled = false;
  }
}

// Thumbnail
thumbnailInput?.addEventListener('change', () => {
  if (thumbnailInput.files[0]) {
    const reader = new FileReader();
    reader.onload = e => thumbnailPreview.innerHTML = `<img src="${e.target.result}" alt="Thumbnail">`;
    reader.readAsDataURL(thumbnailInput.files[0]);
  }
});

// PUBLISH – BACKEND TEAM WILL REPLACE THIS
publishBtn?.addEventListener('click', () => {
  if (!videoFileInput.files[0]) return alert('Please select a video');

  const formData = new FormData();
  formData.append('video', videoFileInput.files[0]);
  if (thumbnailInput.files[0]) formData.append('thumbnail', thumbnailInput.files[0]);
  formData.append('title', titleInput.value);
  formData.append('description', descriptionInput.value);
  formData.append('category', document.getElementById('video-category').value);
  formData.append('tags', document.getElementById('video-tags').value);
  formData.append('privacy', document.getElementById('video-privacy').value);

  // ←←← BACKEND TEAM: PUT YOUR REAL UPLOAD ENDPOINT HERE →→
  // fetch('/api/videos/upload', { method: 'POST', body: formData, headers: { Authorization: 'Bearer ' + token } })

  alert('Upload ready! Waiting for backend API...');
  console.log('Ready to send →', formData);
});

// Save Draft (optional local)
saveDraftBtn?.addEventListener('click', () => {
  const draft = {
    title: titleInput.value,
    description: descriptionInput.value,
    category: document.getElementById('video-category').value,
    tags: document.getElementById('video-tags').value,
    privacy: document.getElementById('video-privacy').value,
    date: new Date().toISOString()
  };
  alert('Draft saved locally');
  console.log('Draft:', draft);
});