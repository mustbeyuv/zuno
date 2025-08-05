import { logout } from './auth.js';
import { searchSongs } from './api.js';
import { renderSearchResults, showNotification } from './ui.js';
import { playSong, playVideo, pauseVideo, nextSong, previousSong, playSongFromFavorites } from './player.js';
import { addFavorite, removeFavorite } from './api.js';
import { state } from '../app.js';

export const initDOM = () => {
    // Elements
    const logoutBtn = document.getElementById('logoutBtn');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const playBtn = document.querySelector('.play-btn');
    const controlBtns = document.querySelectorAll('.control-btn');
    const seekBar = document.getElementById('seekBar');
    const volumeControl = document.getElementById('volumeControl');
    const progressBar = document.querySelector('.progress-bar');
    
    // Event listeners
    if (logoutBtn) logoutBtn.addEventListener('click', logout);
    
    if (searchBtn) {
        searchBtn.addEventListener('click', async () => {
            const query = searchInput.value.trim();
            if (!query) return;

            try {
                const results = await searchSongs(query);
                
                if (!results.length) {
                    document.getElementById('searchResults').innerHTML = `
                        <div class="empty-state">
                            <h3>No results found for "${query}"</h3>
                            <button data-action="openAddSongForm" data-query="${query}">➕ Add this song</button>
                        </div>
                    `;
                } else {
                    renderSearchResults(results);
                }
            } catch (err) {
                console.error('Search failed:', err);
                document.getElementById('searchResults').innerHTML = '<p>❌ Error searching songs</p>';
            }
        });
    }
    
    // Player controls
    if (playBtn) {
        playBtn.addEventListener('click', () => {
            if (state.currentSongIndex >= 0 && state.player) {
                const playerState = state.player.getPlayerState();
                if (playerState === YT.PlayerState.PLAYING) {
                    pauseVideo();
                } else {
                    playVideo();
                }
            } else if (state.songs.length > 0) {
                playSong(state, 0);
            } else {
                showNotification('No songs available to play', 'info');
            }
        });
    }
    
    // Previous/Next controls
    if (controlBtns.length) {
        controlBtns.forEach((btn, index) => {
            if (index === 1) { // Previous button
                btn.addEventListener('click', () => {
                    if (state.songs.length > 0) previousSong(state);
                });
            } else if (index === 3) { // Next button
                btn.addEventListener('click', () => {
                    if (state.songs.length > 0) nextSong(state);
                });
            }
        });
    }
    
    // Delegated event listeners
    document.addEventListener('click', (e) => {
        const action = e.target.dataset.action;
        const songId = e.target.dataset.id;
        const index = e.target.dataset.index;
        const query = e.target.dataset.query;
        
        if (!action) return;
        
        switch (action) {
            case 'playSong':
                playSong(state, parseInt(index));
                break;
            case 'playSongFromFavorites':
                playSongFromFavorites(state, parseInt(index));
                break;
            case 'addFavorite':
                addFavorite(state, songId);
                break;
            case 'removeFavorite':
                removeFavorite(state, songId);
                break;
            case 'openAddSongForm':
                openAddSongForm(query);
                break;
        }
    });
    
    // Seek bar handler
    if (seekBar) {
        seekBar.addEventListener('input', (e) => {
            const percent = e.target.value;
            if (state.player && state.player.getDuration) {
                const duration = state.player.getDuration();
                const newTime = (percent / 100) * duration;
                state.player.seekTo(newTime, true);
            }
        });
    }
    
    // Volume control
    if (volumeControl) {
        volumeControl.addEventListener('input', (e) => {
            const volume = e.target.value / 100;
            if (state.player && state.player.setVolume) {
                state.player.setVolume(volume * 100);
            }
        });
    }
    
    // Progress bar click to seek
    if (progressBar) {
        progressBar.addEventListener('click', (e) => {
            if (state.player && state.player.getDuration) {
                const rect = progressBar.getBoundingClientRect();
                const percent = (e.clientX - rect.left) / rect.width * 100;
                const duration = state.player.getDuration();
                const newTime = (percent / 100) * duration;
                state.player.seekTo(newTime, true);
            }
        });
    }
};

function openAddSongForm(query) {
    // Implementation for opening add song form
    console.log('Opening form for:', query);
    // You can implement a modal or form here
}