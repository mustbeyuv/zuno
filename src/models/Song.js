// src/models/Song.js
const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  youtubeId: { type: String, required: true },
  album: String,
  genre: String,
  duration: Number, // in seconds
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date
});

songSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});


module.exports = mongoose.model('Song', songSchema);