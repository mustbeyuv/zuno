const user = JSON.parse(localStorage.getItem('zunoUser'));
const userId = user?._id;
const songsList = document.getElementById('songsList');
const welcomeUser = document.getElementById('welcomeUser');
const logoutBtn = document.getElementById('logoutBtn');

let songs = [];
let favorites = [];

// 🔐 Auth check
if (!user || !userId) {
  alert("⚠️ You are not logged in!");
  window.location.href = '/';
} else {
  welcomeUser.textContent = `Welcome, ${user.username} 👋`;
}

// 🚪 Logout
logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('zunoUser');
  window.location.href = '/';
});

// ❤️ Load user favorites from DB
async function loadFavorites() {
  try {
    const res = await fetch(`/users/${userId}/favorites`);
    const data = await res.json();
    favorites = data.map(fav => fav._id);
  } catch (err) {
    console.error('❌ Failed to load favorites:', err);
  }
}

// 🎵 Fetch all songs
async function fetchSongs() {
  try {
    const res = await fetch('/songs');
    songs = await res.json();
    renderSongs();
  } catch (err) {
    console.error('❌ Failed to fetch songs:', err);
    songsList.innerHTML = '<p>🚫 Could not load songs.</p>';
  }
}

// 🖼️ Render songs with favorite button
function renderSongs() {
  if (!songs.length) {
    songsList.innerHTML = '<p>No songs available.</p>';
    return;
  }

  songsList.innerHTML = songs.map(song => {
    const isFav = favorites.includes(song._id);
    return `
      <div class="song-item">
        <h4>${song.title}</h4>
        <p>Artist: ${song.artist}</p>
        <button onclick="${isFav ? `removeFavorite('${song._id}')` : `addFavorite('${song._id}')`}">
          ${isFav ? '💔 Remove Favorite' : '❤️ Add to Favorite'}
        </button>
      </div>
    `;
  }).join('');
}

// ➕ Add to favorites
async function addFavorite(songId) {
  try {
    const res = await fetch(`/users/${userId}/favorites`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ songId })
    });

    const data = await res.json();
    favorites = data.favorites.map(f => f._id);
    renderSongs();
  } catch (err) {
    console.error('❌ Error adding favorite:', err);
  }
}

// ➖ Remove from favorites
async function removeFavorite(songId) {
  try {
    const res = await fetch(`/users/${userId}/favorites`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ songId })
    });

    const data = await res.json();
    favorites = data.favorites.map(f => f._id);
    renderSongs();
  } catch (err) {
    console.error('❌ Error removing favorite:', err);
  }
}

// 🚀 Init app
(async () => {
  await loadFavorites();
  await fetchSongs();
})();
