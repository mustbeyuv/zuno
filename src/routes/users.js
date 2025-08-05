const express = require('express');
const router = express.Router();
const User = require('../models/User');

// POST /users/login
router.post('/login', async (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: 'Username required' });

  try {
    let user = await User.findOne({ username });

    let isNew = false;
    if (!user) {
      user = await User.create({ username });
      isNew = true;
    }

    user = await User.findById(user._id).populate('favorites');

    res.json({ user, isNew });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
});
