const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  songs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Song'
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date
});

// Auto-update 'updatedAt' before save
playlistSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Playlist', playlistSchema);
