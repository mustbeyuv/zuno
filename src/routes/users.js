// routes/users.js

const express = require('express');
const router = express.Router();
const User = require('../models/User');

// POST /users - Register a new user
router.post('/', async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    // Check if user already exists
    let user = await User.findOne({ username });

    // If not, create a new one
    if (!user) {
      user = new User({ username });
      await user.save();
    }

    res.status(200).json({ _id: user._id, username: user.username });
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /users?username=someName
router.get('/', async (req, res) => {
  try {
    const { username } = req.query;

    if (!username) {
      return res.status(400).json({ error: 'Username query param is required' });
    }

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ _id: user._id, username: user.username });
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


// GET /users/:id/favorites
router.get('/:id/favorites', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('favorites');
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json(user.favorites);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});


router.patch('/:id/favorites', async (req, res) => {
  try {
    const { songId } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ error: 'User not found' });

    const index = user.favorites.indexOf(songId);

    if (index === -1) {
      user.favorites.push(songId);
    } else {
      user.favorites.splice(index, 1);
    }

    await user.save();
    await user.populate('favorites');

    res.json({ favorites: user.favorites }); // return populated songs
  } catch (err) {
    console.error('Toggle favorite failed:', err);
    res.status(500).json({ error: 'Server error' });
  }
});



module.exports = router;
