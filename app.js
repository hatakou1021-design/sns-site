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
  const feedEl = document.getElementById('feedSection');
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

  // Hide posting form when user not logged in
  const postFormSection = document.getElementById('postSection');

  // Additional UI elements
  const navBar = document.getElementById('navBar');
  const navTimelineBtn = document.getElementById('navTimeline');
  const navSearchBtn = document.getElementById('navSearch');
  const navProfileBtn = document.getElementById('navProfile');
  const categoriesBar = document.getElementById('categoriesBar');
  const searchSection = document.getElementById('searchSection');
  const profileSection = document.getElementById('profileSection');
  const feedSection = document.getElementById('feedSection');

  // If not authenticated, hide posting interface, feed, nav bar, categories, search and profile sections
  if (!currentUser) {
    if (postFormSection) postFormSection.classList.add('hidden');
    if (feedSection) feedSection.classList.add('hidden');
    if (navBar) navBar.classList.add('hidden');
    if (categoriesBar) categoriesBar.classList.add('hidden');
    if (searchSection) searchSection.classList.add('hidden');
    if (profileSection) profileSection.classList.add('hidden');
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

  // Login bonus and navigation initialization
  function handleLoginBonus(user) {
    const todayStr = new Date().toISOString().split('T')[0];
    const lastLoginKey = `sns-last-login-${user.email}`;
    const pointsKey = `sns-points-${user.email}`;
    const last = localStorage.getItem(lastLoginKey);
    if (last !== todayStr) {
      let pts = parseInt(localStorage.getItem(pointsKey) || '0', 10);
      pts += 10;
      localStorage.setItem(pointsKey, pts);
      localStorage.setItem(lastLoginKey, todayStr);
      alert(`ログインボーナス！10ポイントを獲得しました。現在のポイント: ${pts}`);
    }
    const userPointsEl = document.getElementById('userPoints');
    if (userPointsEl) {
      const pts = parseInt(localStorage.getItem(pointsKey) || '0', 10);
      userPointsEl.textContent = pts;
    }
  }

  function showTimeline() {
    if (navTimelineBtn) navTimelineBtn.classList.add('active');
    if (navSearchBtn) navSearchBtn.classList.remove('active');
    if (navProfileBtn) navProfileBtn.classList.remove('active');
    if (categoriesBar) categoriesBar.classList.remove('hidden');
    if (postFormSection) postFormSection.classList.remove('hidden');
    if (feedSection) feedSection.classList.remove('hidden');
    if (searchSection) searchSection.classList.add('hidden');
    if (profileSection) profileSection.classList.add('hidden');
  }

  function showSearch() {
    if (navTimelineBtn) navTimelineBtn.classList.remove('active');
    if (navSearchBtn) navSearchBtn.classList.add('active');
    if (navProfileBtn) navProfileBtn.classList.remove('active');
    if (categoriesBar) categoriesBar.classList.add('hidden');
    if (postFormSection) postFormSection.classList.add('hidden');
    if (feedSection) feedSection.classList.add('hidden');
    if (searchSection) searchSection.classList.remove('hidden');
    if (profileSection) profileSection.classList.add('hidden');
  }

  function showProfile() {
    if (navTimelineBtn) navTimelineBtn.classList.remove('active');
    if (navSearchBtn) navSearchBtn.classList.remove('active');
    if (navProfileBtn) navProfileBtn.classList.add('active');
    if (categoriesBar) categoriesBar.classList.add('hidden');
    if (postFormSection) postFormSection.classList.add('hidden');
    if (feedSection) feedSection.classList.add('hidden');
    if (searchSection) searchSection.classList.add('hidden');
    if (profileSection) profileSection.classList.remove('hidden');
    if (currentUser) {
      const usernameSpan = document.getElementById('profileUsername');
      const emailSpan = document.getElementById('profileEmail');
      if (usernameSpan) usernameSpan.textContent = currentUser.name || '';
      if (emailSpan) emailSpan.textContent = currentUser.email || '';
      const pointsKey = `sns-points-${currentUser.email}`;
      const pts = parseInt(localStorage.getItem(pointsKey) || '0', 10);
      const userPointsEl = document.getElementById('userPoints');
      if (userPointsEl) userPointsEl.textContent = pts;
    }
  }

  // Attach navigation handlers
  if (navTimelineBtn) navTimelineBtn.addEventListener('click', showTimeline);
  if (navSearchBtn) navSearchBtn.addEventListener('click', showSearch);
  if (navProfileBtn) navProfileBtn.addEventListener('click', showProfile);

  // Search functionality
  const searchButton = document.getElementById('searchButton');
  const searchInput = document.getElementById('searchInput');
  const searchResultsEl = document.getElementById('searchResults');
  if (searchButton && searchInput && searchResultsEl) {
    searchButton.addEventListener('click', () => {
      const query = searchInput.value.trim();
      searchResultsEl.innerHTML = '';
      if (!query) {
        searchResultsEl.textContent = 'キーワードを入力してください。';
        return;
      }
      const results = posts.filter(p => p.content.includes(query));
      if (results.length === 0) {
        searchResultsEl.textContent = '該当する投稿はありません。';
        return;
      }
      results
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
          let metaText = date.toLocaleString('ja-JP');
          if (post.author) metaText = `${post.author} · ${metaText}`;
          metaEl.textContent = metaText;
          postEl.appendChild(contentEl);
          postEl.appendChild(metaEl);
          searchResultsEl.appendChild(postEl);
        });
    });
  }

  // Category filtering
  const categoryChips = document.querySelectorAll('.category-chip');
  categoryChips.forEach(chip => {
    chip.addEventListener('click', () => {
      categoryChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const category = chip.textContent.trim();
      let filteredPosts = [];
      if (category === 'すべて') {
        filteredPosts = posts;
      } else {
        filteredPosts = posts.filter(p => p.content.includes(`#${category}`) || p.content.includes(category));
      }
      if (feedEl) {
        feedEl.innerHTML = '';
        filteredPosts
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
            let metaText = date.toLocaleString('ja-JP');
            if (post.author) metaText = `${post.author} · ${metaText}`;
            metaEl.textContent = metaText;
            postEl.appendChild(contentEl);
            postEl.appendChild(metaEl);
            feedEl.appendChild(postEl);
          });
      }
    });
  });

  // Profile form submission (change username)
  const profileForm = document.getElementById('profileForm');
  if (profileForm) {
    profileForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const usernameInput = document.getElementById('profileUsernameInput');
      if (usernameInput && currentUser) {
        const newName = usernameInput.value.trim();
        if (newName) {
          currentUser.name = newName;
          localStorage.setItem(userKey, JSON.stringify(currentUser));
          const usernameSpan = document.getElementById('profileUsername');
          if (usernameSpan) usernameSpan.textContent = newName;
          const headerName = document.getElementById('userName');
          if (headerName) headerName.textContent = newName;
          usernameInput.value = '';
        }
      }
    });
  }

  // If logged in, show navigation and timeline, apply login bonus
  if (currentUser) {
    if (navBar) navBar.classList.remove('hidden');
    handleLoginBonus(currentUser);
    showTimeline();
  }
});
