let songs = [];
let currentIndex = 0;
let player;

// THEME TOGGLE
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('theme') || 'dark';
document.body.setAttribute('data-theme', savedTheme);
themeToggle.textContent = savedTheme === 'light' ? '🌞' : '🌙';

themeToggle.addEventListener('click', () => {
  const newTheme = document.body.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
  document.body.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  themeToggle.textContent = newTheme === 'light' ? '🌞' : '🌙';
});

// FETCH SONGS
async function fetchSongs() {
  try {
    const res = await fetch('/songs');
    const data = await res.json();
    songs = data;
    renderSongs(data);
    setupPlayer();
  } catch (err) {
    document.getElementById('songsList').innerHTML = `<div class="error">Failed to load songs</div>`;
  }
}

// FETCH PLAYLISTS
async function fetchPlaylists() {
  try {
    const res = await fetch('/playlists');
    const data = await res.json();
    renderPlaylists(data);
  } catch (err) {
    document.getElementById('playlistsList').innerHTML = `<div class="error">Failed to load playlists</div>`;
  }
}

// RENDER SONGS
function renderSongs(data) {
  const list = document.getElementById('songsList');
  if (data.length === 0) {
    list.innerHTML = '<div class="loading">No songs found.</div>';
    return;
  }
  list.innerHTML = data.map((song, i) => `
    <div class="item">
      <h4>${song.title}</h4>
      <p>Artist: ${song.artist}</p>
      ${song.genre ? `<p>Genre: ${song.genre}</p>` : ''}
      <button onclick="playSong(${i})" class="btn-small">▶️ Play</button>
    </div>
  `).join('');
}

// RENDER PLAYLISTS
function renderPlaylists(data) {
  const list = document.getElementById('playlistsList');
  if (data.length === 0) {
    list.innerHTML = '<div class="loading">No playlists found.</div>';
    return;
  }
  list.innerHTML = data.map(pl => `
    <div class="item">
      <h4>${pl.name}</h4>
      ${pl.description ? `<p>${pl.description}</p>` : ''}
      <p>${pl.songs?.length || 0} song(s)</p>
      <button onclick="loadPlaylist('${pl._id}')" class="btn-small">📂 Load</button>
    </div>
  `).join('');
}

// LOAD PLAYLIST SONGS
async function loadPlaylist(id) {
  try {
    const res = await fetch(`/playlists/${id}`);
    const pl = await res.json();
    songs = pl.songs;
    currentIndex = 0;
    updateNowPlaying();
    setupPlayer(true); // force reload
    renderSongs(songs);
  } catch (err) {
    document.getElementById('songMessage').innerHTML = `<div class="error">Failed to load playlist</div>`;
  }
}

// YOUTUBE API
function onYouTubeIframeAPIReady() {
  if (songs.length > 0) setupPlayer();
}

function setupPlayer(force = false) {
  if (!songs.length) return;
  const videoId = songs[currentIndex]?.youtubeId;
  if (player && force) {
    player.loadVideoById(videoId);
  } else if (!player) {
    player = new YT.Player('player', {
      height: '360',
      width: '640',
      videoId: videoId,
      events: {
        onReady: () => updateNowPlaying(),
        onStateChange: event => {
          if (event.data === YT.PlayerState.ENDED) nextSong();
        }
      }
    });
  }
}

function playSong(index) {
  currentIndex = index;
  player.loadVideoById(songs[currentIndex].youtubeId);
  updateNowPlaying();
}

function playVideo() {
  player?.playVideo();
}

function pauseVideo() {
  player?.pauseVideo();
}

function nextSong() {
  currentIndex = (currentIndex + 1) % songs.length;
  player.loadVideoById(songs[currentIndex].youtubeId);
  updateNowPlaying();
}

function updateNowPlaying() {
  const song = songs[currentIndex];
  document.getElementById('now-playing').innerText =
    `Now Playing: ${song.title} - ${song.artist}`;
}

// INIT
document.addEventListener('DOMContentLoaded', () => {
  fetchSongs();
  fetchPlaylists();
});
