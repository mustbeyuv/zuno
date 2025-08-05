import { post } from './api.js';
import { showSection } from './ui.js';
import { loadAndRenderSongs } from './player.js';

let currentUser = null;
const saved = localStorage.getItem('zunoUser');
if (saved) currentUser = JSON.parse(saved);

export function getCurrentUser() {
  return currentUser;
}

export function initLoginFlow() {
  const input = document.getElementById('usernameInput');
  const button = document.getElementById('startBtn');
  const logoutBtn = document.getElementById('logoutBtn');

  if (currentUser) {
    showSection('mainApp');
    renderWelcomeMessage(`Welcome back, ${currentUser.username}! 👋`);
    loadAndRenderSongs();
  }

  button.addEventListener('click', async () => {
    const username = input.value.trim();
    if (!username) return alert('Please enter your name');

    try {
      const { user, isNew } = await post('/users/login', { username });
      currentUser = user;
      localStorage.setItem('zunoUser', JSON.stringify(user));

      const msg = isNew
        ? `Welcome, ${user.username}! 🎉`
        : `Welcome back, ${user.username}! 👋`;

      renderWelcomeMessage(msg);
      showSection('mainApp');
      loadAndRenderSongs();
    } catch (err) {
      alert('Login failed. Please try again.');
    }
  });

  logoutBtn.addEventListener('click', () => {
    currentUser = null;
    localStorage.removeItem('zunoUser');
    showSection('loginSection');
  });
}

export async function refreshCurrentUser() {
  if (!currentUser) return;

  try {
    const { user } = await post('/users/login', {
      username: currentUser.username
    });
    currentUser = user;
    localStorage.setItem('zunoUser', JSON.stringify(user));
  } catch (err) {
    console.error('Failed to refresh user:', err);
  }
}

export async function toggleFavorite(songId, isLiking) {
  if (!currentUser) return;

  try {
    const res = await post('/users/favorite', {
      username: currentUser.username,
      songId,
      action: isLiking ? 'add' : 'remove'
    });

    currentUser.favorites = res.favorites;
    localStorage.setItem('zunoUser', JSON.stringify(currentUser));
  } catch (err) {
    alert('Failed to update favorite.');
  }
}

function renderWelcomeMessage(text) {
  const el = document.getElementById('welcomeMsg');
  if (el) el.textContent = text;
}
