import { get } from './api.js';
import {
  getCurrentUser,
  toggleFavorite,
  refreshCurrentUser
} from './auth.js';

export async function loadAndRenderSongs() {
  const songsList = document.getElementById('songsList');
  const likedList = document.getElementById('likedSongsList');

  songsList.innerHTML = '';
  likedList.innerHTML = '';

  try {
    const songs = await get('/songs');
    await refreshCurrentUser(); // ✅ Ensure we have the latest favorites

    renderAllSongs(songs);
    renderLikedSongs(songs);
  } catch (err) {
    alert('Failed to load songs.');
    console.error(err);
  }
}

function renderAllSongs(songs) {
  const songsList = document.getElementById('songsList');
  const user = getCurrentUser();
  const favoriteIds = user?.favorites.map(f => f.toString()) || [];

  songsList.innerHTML = '';

  songs.forEach(song => {
    const songId = song._id.toString();
    const isLiked = favoriteIds.includes(songId);

    const songEl = document.createElement('div');
    songEl.className = 'song-item';

    const info = document.createElement('span');
    info.className = 'song-info';
    info.textContent = `${song.title} — ${song.artist}`;

    const likeBtn = document.createElement('span');
    likeBtn.className = 'material-icons like-btn';
    likeBtn.textContent = isLiked ? 'favorite' : 'favorite_border';

    likeBtn.addEventListener('click', async () => {
      const nowLiking = likeBtn.textContent === 'favorite_border';
      likeBtn.textContent = nowLiking ? 'favorite' : 'favorite_border';

      try {
        await toggleFavorite(songId, nowLiking);
        await refreshCurrentUser(); // ✅ Refresh favorites after like
        renderLikedSongs(songs);   // ✅ Re-render only liked section
      } catch (err) {
        likeBtn.textContent = nowLiking ? 'favorite_border' : 'favorite'; // rollback
        alert('Failed to update favorite.');
        console.error(err);
      }
    });

    songEl.appendChild(info);
    songEl.appendChild(likeBtn);
    songsList.appendChild(songEl);
  });
}

function renderLikedSongs(songs) {
  const likedList = document.getElementById('likedSongsList');
  likedList.innerHTML = '';

  const user = getCurrentUser();
  if (!user || !user.favorites) {
    likedList.innerHTML = `<p style="color: #777;">No liked songs yet.</p>`;
    return;
  }

  const favoriteIds = user.favorites.map(f => f.toString());
  const likedSongs = songs.filter(song =>
    favoriteIds.includes(song._id.toString())
  );

  if (likedSongs.length === 0) {
    likedList.innerHTML = `<p style="color: #777;">No liked songs yet.</p>`;
  } else {
    likedSongs.forEach(song => {
      const el = document.createElement('div');
      el.className = 'song-item';
      el.textContent = `${song.title} — ${song.artist}`;
      likedList.appendChild(el);
    });
  }
}
