const express = require('express');
const router = express.Router();
const Song = require('../models/Song');

// GET /songs - get all songs or favorites
router.get('/', async (req, res) => {
  try {
    const favoritesOnly = req.query.favorites === 'true';
    const songs = await Song.find(favoritesOnly ? { isFavorite: true } : {});
    res.json(songs);
  } catch (error) {
    console.error('Error fetching songs:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /songs/:id - get a specific song by ID
router.get('/:id', async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) {
      return res.status(404).json({ message: 'Song not found' });
    }
    res.json(song);
  } catch (error) {
    console.error('Error fetching song:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /songs - Create a new song
router.post('/', async (req, res) => {
  try {
    const { title, artist, youtubeId, album, genre, duration } = req.body;

    if (!title || !artist || !youtubeId) {
      return res.status(400).json({ error: 'Title, artist, and youtubeId are required' });
    }

    const newSong = new Song({
      title,
      artist,
      youtubeId,
      album,
      genre,
      duration
    });

    await newSong.save();
    res.status(201).json({ message: '✅ Song created successfully', song: newSong });

  } catch (err) {
    console.error('Error creating song:', err);
    res.status(500).json({ error: '❌ Failed to create song', details: err.message });
  }
});

// PUT /songs/:id - Update song (e.g. title, artist, favorite, etc.)
router.put('/:id', async (req, res) => {
  try {
    const updatedSong = await Song.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedSong) {
      return res.status(404).json({ message: 'Song not found' });
    }
    res.json({ message: '✅ Song updated', song: updatedSong });
  } catch (err) {
    console.error('Error updating song:', err);
    res.status(500).json({ error: 'Failed to update song' });
  }
});

// DELETE /songs/:id - Delete song
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Song.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Song not found' });
    }
    res.json({ message: '🗑️ Song deleted' });
  } catch (err) {
    console.error('Error deleting song:', err);
    res.status(500).json({ error: 'Failed to delete song' });
  }
});

module.exports = router;
