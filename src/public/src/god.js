// Get user from localStorage and initialize variables
const user = JSON.parse(localStorage.getItem('zunoUser'));
const userId = user?._id;
const songsList = document.getElementById('songsList');
const welcomeUser = document.getElementById('welcomeUser');
const logoutBtn = document.getElementById('logoutBtn');
const likedSongsList = document.getElementById('likedSongsList');
const allSongsCount = document.getElementById('allSongsCount');
const likedSongsCount = document.getElementById('likedSongsCount');
const playerTitle = document.querySelector('.player-title');
const playerArtist = document.querySelector('.player-artist');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const searchResults = document.getElementById('searchResults');

let songs = [];
let favorites = [];
let currentSongIndex = 0;
let player;
let seekInterval;

// 🔐 Auth check
if (!user || !userId) {
    alert("⚠️ You are not logged in!");
    window.location.href = '/';
} else {
    welcomeUser.textContent = `Welcome, ${user.username} 👋`;
}

// 🚪 Logout
logoutBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('zunoUser');
        window.location.href = '/';
    }
});

// 🔍 Perform search
searchBtn.addEventListener('click', async () => {
  const query = searchInput.value.trim();
  if (!query) return;

  try {
    const res = await fetch(`/songs/search?q=${encodeURIComponent(query)}`);
    const results = await res.json();

    if (!results.length) {
      searchResults.innerHTML = `
        <div class="empty-state">
          <h3>No results found for "${query}"</h3>
          <button onclick="openAddSongForm('${query}')">➕ Add this song</button>
        </div>
      `;
    } else {
      renderSearchResults(results);
    }
  } catch (err) {
    console.error('Search failed:', err);
    searchResults.innerHTML = '<p>❌ Error searching songs</p>';
  }
});

// 🔍 Perform search
searchBtn.addEventListener('click', async () => {
  const query = searchInput.value.trim();
  if (!query) return;

  try {
    const res = await fetch(`/songs/search?q=${encodeURIComponent(query)}`);
    const results = await res.json();

    if (!results.length) {
      searchResults.innerHTML = `
        <div class="empty-state">
          <h3>No results found for "${query}"</h3>
          <button onclick="openAddSongForm('${query}')">➕ Add this song</button>
        </div>
      `;
    } else {
      renderSearchResults(results);
    }
  } catch (err) {
    console.error('Search failed:', err);
    searchResults.innerHTML = '<p>❌ Error searching songs</p>';
  }
});

// ❤️ Load user favorites from DB
async function loadFavorites() {
    try {
        const res = await fetch(`/users/${userId}/favorites`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        favorites = data.map(fav => fav._id);
        updateCounts();
    } catch (err) {
        console.error('❌ Failed to load favorites:', err);
        showNotification('Failed to load favorites', 'error');
    }
}

// 🎵 Fetch all songs
async function fetchSongs() {
    try {
        const res = await fetch('/songs');
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        songs = await res.json();
        renderSongs();
        renderLikedSongs();
        updateCounts();
    } catch (err) {
        console.error('❌ Failed to fetch songs:', err);
        songsList.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🚫</div>
                <h3>Could not load songs</h3>
                <p>Please check your connection and try again</p>
            </div>
        `;
        showNotification('Failed to load songs', 'error');
    }
}

// Update song counts
function updateCounts() {
    allSongsCount.textContent = `${songs.length} songs`;
    likedSongsCount.textContent = `${favorites.length} songs`;
}

// 🖼️ Render all songs with favorite button
function renderSongs() {
    if (!songs.length) {
        songsList.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🎵</div>
                <h3>No songs available</h3>
                <p>Add songs to your library</p>
            </div>
        `;
        return;
    }

    songsList.innerHTML = songs.map((song, index) => {
        const isFav = favorites.includes(song._id);
        return `
            <div class="song-item">
                <div class="song-header">
                    <div>
                        <div class="song-title">${escapeHtml(song.title)}</div>
                        <div class="song-artist">${escapeHtml(song.artist)}</div>
                    </div>
                    <button class="fav-btn btn-icon ${isFav ? 'active' : ''}" onclick="${isFav ? `removeFavorite('${song._id}')` : `addFavorite('${song._id}')`}">
                        ${isFav ? '❤️' : '🤍'}
                    </button>
                </div>
                <div class="song-buttons">
                    <button class="btn btn-primary" onclick="playSong(${index})">▶ Play</button>
                    <button class="btn btn-secondary" onclick="${isFav ? `removeFavorite('${song._id}')` : `addFavorite('${song._id}')`}">
                        ${isFav ? '💔 Remove' : '❤️ Add Favorite'}
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Renders only favorite songs
function renderLikedSongs() {
    if (!favorites.length) {
        likedSongsList.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🫠</div>
                <h3>No liked songs yet</h3>
                <p>Start adding songs to your favorites!</p>
            </div>
        `;
        return;
    }

    const liked = songs.filter(song => favorites.includes(song._id));
    likedSongsList.innerHTML = liked.map((song, index) => `
        <div class="song-item">
            <div class="song-header">
                <div>
                    <div class="song-title">${escapeHtml(song.title)}</div>
                    <div class="song-artist">${escapeHtml(song.artist)}</div>
                </div>
                <button class="fav-btn btn-icon active" onclick="removeFavorite('${song._id}')">
                    ❤️
                </button>
            </div>
            <div class="song-buttons">
                <button class="btn btn-primary" onclick="playSongFromFavorites(${index})">▶ Play</button>
                <button class="btn btn-secondary" onclick="removeFavorite('${song._id}')">💔 Remove</button>
            </div>
        </div>
    `).join('');
}

// ➕ Add to favorites
async function addFavorite(songId) {
    try {
        showLoading();
        const res = await fetch(`/users/${userId}/favorites`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ songId })
        });

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        const data = await res.json();
        favorites = data.favorites.map(f => f._id);
        renderSongs();
        renderLikedSongs();
        updateCounts();
        showNotification('Song added to favorites!', 'success');
    } catch (err) {
        console.error('❌ Error adding favorite:', err);
        showNotification('Failed to add to favorites', 'error');
    }
}

// ➖ Remove from favorites
async function removeFavorite(songId) {
    try {
        showLoading();
        const res = await fetch(`/users/${userId}/favorites`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ songId })
        });

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        const data = await res.json();
        favorites = data.favorites.map(f => f._id);
        renderSongs();
        renderLikedSongs();
        updateCounts();
        showNotification('Song removed from favorites!', 'success');
    } catch (err) {
        console.error('❌ Error removing favorite:', err);
        showNotification('Failed to remove from favorites', 'error');
    }
}

// YouTube Player Integration
function onYouTubeIframeAPIReady() {
    if (!songs.length) return;

    player = new YT.Player('youtube-player-frame', {
        height: '360',
        width: '640',
        videoId: songs[currentSongIndex]?.youtubeId,
        events: {
            onReady: () => {
                updateNowPlayingUI();
                initSeekUpdater();
            },
            onStateChange: (e) => {
                if (e.data === YT.PlayerState.ENDED) nextSong();
                updatePlayerButtons(e.data);
            }
        }
    });
}

// Play a song by index
function playSong(index) {
    if (songs[index]) {
        currentSongIndex = index;
        const song = songs[index];
        
        if (player) {
            player.loadVideoById(song.youtubeId);
        } else {
            onYouTubeIframeAPIReady();
        }
        
        updateNowPlayingUI();
        updatePlayerDisplay(song);
        showNotification(`Now playing: ${song.title}`, 'info');
    }
}

function playVideo() {
    player?.playVideo();
}

function pauseVideo() {
    player?.pauseVideo();
}

function nextSong() {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    playSong(currentSongIndex);
}

function previousSong() {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    playSong(currentSongIndex);
}

function togglePlayerView() {
    const fullPlayer = document.getElementById('full-player');
    if (fullPlayer) {
        fullPlayer.classList.toggle('hidden');
    }
}

function updateNowPlayingUI() {
    const song = songs[currentSongIndex];
    if (!song) return;

    const nowPlayingInfo = document.getElementById('now-playing-info');
    const fullSongTitle = document.getElementById('full-song-title');
    const thumbnailPreview = document.getElementById('thumbnailPreview');
    
    if (nowPlayingInfo) {
        nowPlayingInfo.textContent = `🎧 ${song.title} - ${song.artist}`;
    }
    if (fullSongTitle) {
        fullSongTitle.textContent = `${song.title} - ${song.artist}`;
    }
    if (thumbnailPreview && song.youtubeId) {
        thumbnailPreview.src = `https://img.youtube.com/vi/${song.youtubeId}/default.jpg`;
    }
}

function updatePlayerDisplay(song) {
    const playerTitle = document.querySelector('.player-title');
    const playerArtist = document.querySelector('.player-artist');
    
    if (playerTitle) playerTitle.textContent = song.title;
    if (playerArtist) playerArtist.textContent = song.artist;
}

function updatePlayerButtons(playerState) {
    const playBtn = document.querySelector('.play-btn');
    if (!playBtn) return;
    
    if (playerState === YT.PlayerState.PLAYING) {
        playBtn.textContent = '⏸';
    } else {
        playBtn.textContent = '▶';
    }
}

// Seek bar updater
function initSeekUpdater() {
    clearInterval(seekInterval);

    seekInterval = setInterval(() => {
        if (player && player.getCurrentTime && player.getDuration) {
            const currentTime = player.getCurrentTime();
            const duration = player.getDuration();
            const percent = (currentTime / duration) * 100;
            
            const seekBar = document.getElementById('seekBar');
            const progressBar = document.querySelector('.progress');
            const currentTimeSpan = document.querySelector('.player-time span:first-child');
            const durationSpan = document.querySelector('.player-time span:last-child');
            
            if (seekBar) seekBar.value = percent || 0;
            if (progressBar) progressBar.style.width = `${percent || 0}%`;
            if (currentTimeSpan) currentTimeSpan.textContent = formatTime(currentTime);
            if (durationSpan) durationSpan.textContent = formatTime(duration);
        }
    }, 1000);
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Plays a song from the liked list
function playSongFromFavorites(index) {
    const liked = songs.filter(song => favorites.includes(song._id));
    const song = liked[index];
    const originalIndex = songs.findIndex(s => s._id === song._id);
    playSong(originalIndex);
}

// Utility function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Show loading indicator
function showLoading() {
    // You can implement a loading indicator here if needed
    console.log('Loading...');
}

// Show notifications
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const colors = {
        success: '#1DB954',
        error: '#e74c3c',
        info: '#3498db'
    };
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type] || colors.info};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        font-weight: 500;
        font-size: 14px;
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Slide in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Player controls
document.querySelector('.play-btn')?.addEventListener('click', () => {
    if (currentSongIndex >= 0 && player) {
        const playerState = player.getPlayerState();
        if (playerState === YT.PlayerState.PLAYING) {
            pauseVideo();
        } else {
            playVideo();
        }
    } else if (songs.length > 0) {
        playSong(0); // Play first song if none selected
    } else {
        showNotification('No songs available to play', 'info');
    }
});

// Previous/Next controls
document.querySelectorAll('.control-btn').forEach((btn, index) => {
    if (index === 1) { // Previous button
        btn.addEventListener('click', () => {
            if (songs.length > 0) {
                previousSong();
            }
        });
    } else if (index === 3) { // Next button
        btn.addEventListener('click', () => {
            if (songs.length > 0) {
                nextSong();
            }
        });
    }
});

// Event listeners for seek and volume controls (if they exist)
document.addEventListener('DOMContentLoaded', () => {
    const seekBar = document.getElementById('seekBar');
    const volumeControl = document.getElementById('volumeControl');
    const progressBar = document.querySelector('.progress-bar');
    
    // Seek bar handler
    if (seekBar) {
        seekBar.addEventListener('input', (e) => {
            const percent = e.target.value;
            if (player && player.getDuration) {
                const duration = player.getDuration();
                const newTime = (percent / 100) * duration;
                player.seekTo(newTime, true);
            }
        });
    }
    
    // Volume control
    if (volumeControl) {
        volumeControl.addEventListener('input', (e) => {
            const volume = e.target.value / 100;
            if (player && player.setVolume) {
                player.setVolume(volume * 100);
            }
        });
    }
    
    // Progress bar click to seek
    if (progressBar) {
        progressBar.addEventListener('click', (e) => {
            if (player && player.getDuration) {
                const rect = progressBar.getBoundingClientRect();
                const percent = (e.clientX - rect.left) / rect.width * 100;
                const duration = player.getDuration();
                const newTime = (percent / 100) * duration;
                player.seekTo(newTime, true);
            }
        });
    }
});

// 🚀 Initialize app
(async () => {
    try {
        // Show loading state
        songsList.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🎵</div>
                <h3>Loading songs...</h3>
                <p>Please wait while we load your music library</p>
            </div>
        `;
        
        likedSongsList.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">❤️</div>
                <h3>Loading favorites...</h3>
                <p>Please wait...</p>
            </div>
        `;
        
        // Load data
        await loadFavorites();
        await fetchSongs();
        
        // Initialize YouTube player after songs are loaded
        if (songs.length > 0 && typeof YT !== 'undefined') {
            onYouTubeIframeAPIReady();
        }
        
        showNotification('Welcome to Zuno Music!', 'success');
    } catch (error) {
        console.error('Failed to initialize app:', error);
        showNotification('Failed to load application', 'error');
    }
})();

// Load YouTube API if not already loaded
if (typeof YT === 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(script);
}