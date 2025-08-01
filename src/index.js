const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const songsRouter = require('./routes/songs');
const playlistsRouter = require('./routes/playlists');
const connectDB = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;


// Connect to MongoDB
connectDB();


// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.use('/songs', songsRouter);
app.use('/playlists', playlistsRouter);

// Serve index.html for root route
app.get('/src', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Zuno server running on http://localhost:${PORT}`);
});