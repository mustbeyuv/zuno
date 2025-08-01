
// src/scripts/seedPlaylists.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Playlist = require('../models/Playlist');
const Song = require('../models/Song');

dotenv.config();

const samplePlaylists = [
  {
    name: 'Chill Vibes',
    description: 'Relaxing tracks for work or study',
  },
  {
    name: 'Rock Anthems',
    description: 'Classic rock bangers to get you pumped',
  },
  {
    name: 'Pop Party',
    description: 'Top pop hits from recent years',
  }
];

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const songs = await Song.find();
    if (songs.length < 10) throw new Error("Not enough songs to seed playlists");

    // Attach random songs to each playlist
    const playlistsWithSongs = samplePlaylists.map((playlist) => ({
      ...playlist,
      songs: songs
        .sort(() => 0.5 - Math.random()) // shuffle
        .slice(0, 5)                     // pick 5
        .map((song) => song._id),
    }));

    await Playlist.deleteMany({});
    await Playlist.insertMany(playlistsWithSongs);

    console.log('✅ Seeded playlists successfully');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding playlists failed:', err.message);
    process.exit(1);
  }
})();
