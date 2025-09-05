// app.js
// Main script for the simple SNS application. This script applies
// configuration values, manages posts in localStorage, and renders
// the user interface. It is intentionally kept modular and
// straightforward to make it easy to extend and modify.

document.addEventListener('DOMContentLoaded', () => {
  const config = window.CONFIG || {};
  const siteName = config.siteName || 'MySNS';
  const theme = config.theme || {};

  // Authentication: read current user from localStorage. If a user is
  // logged in via auth.js, their data will be stored under the
  // 'sns-user' key. This allows app.js to determine whether to show
  // the posting interface and to attribute posts to the correct
  // author.
  const userKey = 'sns-user';
  const currentUserStr = localStorage.getItem(userKey);
  const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null;

  // Update the site title in the document and header
  document.title = siteName;
  const titleEl = document.getElementById('siteTitle');
  if (titleEl) titleEl.textContent = siteName;

  // Apply theme colours using CSS variables
  function applyTheme(theme) {
    if (theme.primaryColor) {
      document.documentElement.style.setProperty('--primary-color', theme.primaryColor);
    }
    if (theme.secondaryColor) {
      document.documentElement.style.setProperty('--secondary-color', theme.secondaryColor);
    }
    if (theme.accentColor) {
      document.documentElement.style.setProperty('--accent-color', theme.accentColor);
    }
    if (theme.textColor) {
      document.documentElement.style.setProperty('--text-color', theme.textColor);
    }
  }
  applyTheme(theme);

  // Array to store posts
  let posts = [];
  const storageKey = 'sns-posts';

  // Load posts from localStorage or use a default example
  function loadPosts() {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        posts = JSON.parse(saved);
      } else {
        // If no saved posts, start with a welcome post
        posts = [
          {
            id: Date.now(),
            content: 'ようこそ！これは最初の投稿です。',
            created: new Date().toISOString()
          }
        ];
      }
    } catch (err) {
      console.error('Error loading posts from localStorage:', err);
      posts = [];
    }
  }

  // Save current posts to localStorage
  function savePosts() {
    try {
      localStorage.setItem(storageKey, JSON.stringify(posts));
    } catch (err) {
      console.error('Error saving posts to localStorage:', err);
    }
  }

  // Render all posts to the feed
  const feedEl = document.getElementById('feed');
  function renderPosts() {
    if (!feedEl) return;
    // Clear existing posts
    feedEl.innerHTML = '';
    // Render posts in reverse order (newest first)
    posts
      .slice()
      .sort((a, b) => new Date(b.created) - new Date(a.created))
      .forEach(post => {
        const postEl = document.createElement('div');
        postEl.className = 'post';

        const contentEl = document.createElement('div');
        contentEl.className = 'content';
        contentEl.textContent = post.content;

        const metaEl = document.createElement('div');
        metaEl.className = 'meta';
        const date = new Date(post.created);
        // Prepend author information if available
        let metaText = date.toLocaleString('ja-JP');
        if (post.author) {
          metaText = `${post.author} · ${metaText}`;
        }
        metaEl.textContent = metaText;

        postEl.appendChild(contentEl);
        postEl.appendChild(metaEl);
        feedEl.appendChild(postEl);
      });
  }

  // Initialize posts and render them
  loadPosts();
  renderPosts();

  // Hide the posting form when the user is not logged in. Without a user
  // logged in, we still display existing posts, but the form itself
  // should be hidden to encourage authentication.
  const postFormSection = document.querySelector('.post-form');
  if (!currentUser && postFormSection) {
    postFormSection.classList.add('hidden');
  }

  // Handle new post submissions
  const form = document.getElementById('postForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const textarea = document.getElementById('postContent');
      if (!textarea) return;
      const content = textarea.value.trim();
      if (!content) return;
      // Prevent posting if the user is not logged in
      if (!currentUser) {
        alert('投稿するにはログインが必要です。');
        return;
      }
      const post = {
        id: Date.now(),
        content,
        created: new Date().toISOString(),
        author: currentUser.name || currentUser.email
      };
      posts.push(post);
      savePosts();
      renderPosts();
      textarea.value = '';
    });
  }
});
