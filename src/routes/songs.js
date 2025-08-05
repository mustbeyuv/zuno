const express = require('express');
const router = express.Router();
const Song = require('../models/Song');

// GET /songs
router.get('/', async (req, res) => {
  try {
    const songs = await Song.find();
    res.json(songs);
  } catch (err) {
    console.error('Error fetching songs:', err);
    res.status(500).json({ error: 'Failed to fetch songs' });
  }
});

module.exports = router;
