let player;
let currentSongIndex = 0;
let seekInterval;

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
      }
    }
  });
}

function playSong(index) {
  currentSongIndex = index;
  const song = songs[index];
  if (player) {
    player.loadVideoById(song.youtubeId);
  } else {
    onYouTubeIframeAPIReady();
  }
  updateNowPlayingUI();
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

function togglePlayerView() {
  document.getElementById('full-player').classList.toggle('hidden');
}

function updateNowPlayingUI() {
  const song = songs[currentSongIndex];
  if (!song) return;

  document.getElementById('now-playing-info').textContent = `🎧 ${song.title} - ${song.artist}`;
  document.getElementById('full-song-title').textContent = `${song.title} - ${song.artist}`;
  document.getElementById('thumbnailPreview').src = `https://img.youtube.com/vi/${song.youtubeId}/default.jpg`;
}

// ✅ Seek bar updater
function initSeekUpdater() {
  clearInterval(seekInterval); // clear any existing ones

  seekInterval = setInterval(() => {
    if (player && player.getCurrentTime && player.getDuration) {
      const currentTime = player.getCurrentTime();
      const duration = player.getDuration();
      const percent = (currentTime / duration) * 100;
      document.getElementById('seekBar').value = percent || 0;
    }
  }, 1000);
}

// ✅ Seek bar handler
document.getElementById('seekBar').addEventListener('input', (e) => {
  const percent = e.target.value;
  const duration = player.getDuration();
  const newTime = (percent / 100) * duration;
  player.seekTo(newTime, true);
});

// ✅ Volume control (bind once!)
document.getElementById('volumeControl').addEventListener('input', (e) => {
  const volume = e.target.value / 100;
  if (player && player.setVolume) {
    player.setVolume(volume * 100); // 0–100
  }
});
