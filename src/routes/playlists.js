const express = require('express');
const router = express.Router();
const Playlist = require('../models/Playlist');
const Song = require('../models/Song');

// POST /playlists/:id/songs
router.post('/:id/songs', async (req, res) => {
  try {
    const { songId } = req.body;

    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) return res.status(404).json({ error: 'Playlist not found' });

    if (!songId) return res.status(400).json({ error: 'songId is required' });

    if (playlist.songs.includes(songId)) {
      return res.status(400).json({ error: 'Song already in playlist' });
    }

    playlist.songs.push(songId);
    playlist.updatedAt = new Date();
    await playlist.save();

    res.json({ message: '✅ Song added', playlist });
  } catch (err) {
    res.status(500).json({ error: '❌ Failed to add song', details: err.message });
  }
});

// ✅ GET /playlists - Get all playlists
router.get('/', async (req, res) => {
  try {
    const playlists = await Playlist.find().populate('songs');
    res.json(playlists);
  } catch (err) {
    res.status(500).json({ error: '❌ Failed to fetch playlists', details: err.message });
  }
});




// ✅ GET /playlists/:id - Get a specific playlist by ID
router.get('/:id', async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id).populate('songs');
    if (!playlist) {
      return res.status(404).json({ error: 'Playlist not found' });
    }
    res.json(playlist);
  } catch (err) {
    res.status(500).json({ error: '❌ Failed to fetch playlist', details: err.message });
  }
});

// ✅ PUT /playlists/:id - Update a playlist
router.put('/:id', async (req, res) => {
  try {
    const { name, description, songIds } = req.body;

    const playlist = await Playlist.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        songs: songIds || [],
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!playlist) {
      return res.status(404).json({ error: 'Playlist not found' });
    }

    res.json({ message: '✅ Playlist updated', playlist });
  } catch (err) {
    res.status(500).json({ error: '❌ Failed to update playlist', details: err.message });
  }
});

// DELETE /playlists/:id/songs/:songId
router.delete('/:id/songs/:songId', async (req, res) => {
  try {
    const { id, songId } = req.params;

    const playlist = await Playlist.findById(id);
    if (!playlist) return res.status(404).json({ error: 'Playlist not found' });

    playlist.songs = playlist.songs.filter((sId) => sId.toString() !== songId);
    playlist.updatedAt = new Date();
    await playlist.save();

    res.json({ message: '🗑️ Song removed', playlist });
  } catch (err) {
    res.status(500).json({ error: '❌ Failed to remove song', details: err.message });
  }
});

module.exports = router;
