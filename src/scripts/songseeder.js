// scripts/seedRealSongs.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Song = require('../models/Song'); // adjust path if needed

dotenv.config();

// List of 20 real songs with valid YouTube video IDs
const realSongs = [
  { title: "Blinding Lights", artist: "The Weeknd", genre: "Pop", youtubeId: "fHI8X4OXluQ", duration: 200 },
  { title: "Shape of You", artist: "Ed Sheeran", genre: "Pop", youtubeId: "JGwWNGJdvx8", duration: 240 },
  { title: "Someone Like You", artist: "Adele", genre: "Pop", youtubeId: "hLQl3WQQoQ0", duration: 290 },
  { title: "Bohemian Rhapsody", artist: "Queen", genre: "Rock", youtubeId: "fJ9rUzIMcZQ", duration: 355 },
  { title: "Smells Like Teen Spirit", artist: "Nirvana", genre: "Rock", youtubeId: "hTWKbfoikeg", duration: 301 },
  { title: "Bad Guy", artist: "Billie Eilish", genre: "Pop", youtubeId: "DyDfgMOUjCI", duration: 195 },
  { title: "Believer", artist: "Imagine Dragons", genre: "Rock", youtubeId: "7wtfhZwyrcc", duration: 204 },
  { title: "Levitating", artist: "Dua Lipa", genre: "Pop", youtubeId: "TUVcZfQe-Kw", duration: 203 },
  { title: "Uptown Funk", artist: "Bruno Mars", genre: "Funk", youtubeId: "OPf0YbXqDm0", duration: 270 },
  { title: "Numb", artist: "Linkin Park", genre: "Rock", youtubeId: "kXYiU_JCYtU", duration: 215 },
  { title: "Perfect", artist: "Ed Sheeran", genre: "Pop", youtubeId: "2Vv-BfVoq4g", duration: 263 },
  { title: "Senorita", artist: "Shawn Mendes & Camila Cabello", genre: "Latin Pop", youtubeId: "Pkh8UtuejGw", duration: 191 },
  { title: "Peaches", artist: "Justin Bieber", genre: "R&B", youtubeId: "tQ0yjYUFKAE", duration: 198 },
  { title: "Stay", artist: "The Kid LAROI & Justin Bieber", genre: "Pop", youtubeId: "kTJczUoc26U", duration: 141 },
  { title: "MONTERO (Call Me By Your Name)", artist: "Lil Nas X", genre: "Hip-Hop", youtubeId: "6swmTBVI83k", duration: 137 },
  { title: "Shivers", artist: "Ed Sheeran", genre: "Pop", youtubeId: "Il0S8BoucSA", duration: 238 },
  { title: "drivers license", artist: "Olivia Rodrigo", genre: "Pop", youtubeId:"ZmDBbnmKpqQ", duration: 242 },
  { title: "Rolling in the Deep", artist: "Adele", genre: "Soul", youtubeId: "rYEDA3JcQqw", duration: 228 },
  { title: "Counting Stars", artist: "OneRepublic", genre: "Pop Rock", youtubeId: "hT_nvWreIhg", duration: 257 },
  { title: "See You Again", artist: "Wiz Khalifa ft. Charlie Puth", genre: "Hip-Hop", youtubeId: "RgKAFK5djSk", duration: 229 }
  
];

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Song.deleteMany({});
    await Song.insertMany(realSongs);
    console.log("✅ Seeded 20 real songs successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
    process.exit(1);
  }
})();
