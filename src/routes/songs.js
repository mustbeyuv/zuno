const express = require('express');
const router = express.Router();
const Song = require('../models/Song'); // Import the Song model


// --------------------------------------------



// GET /songs - get all songs
router.get('/', async (req, res) => {
  try {
    const songs = await Song.find();
    res.json(songs);
  } catch (error) {
    console.error(error);
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
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;


// ----------------------------------------------------------



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

    res.status(201).json({
      message: '✅ Song created successfully',
      song: newSong
    });
  } catch (err) {
    res.status(500).json({ error: '❌ Failed to create song', details: err.message });
  }
});

module.exports = router;