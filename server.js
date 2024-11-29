const express = require('express');
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables
dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Create Express app
const app = express();
app.use(cors());
app.use(express.json());

// Root route for /
app.get('/', (req, res) => {
  res.send('Welcome to the Backend Server!');
});

// Route to fetch all videos from Cloudinary
app.get('/api/videos', async (req, res) => {
  try {
    const result = await cloudinary.api.resources({
      resource_type: 'video',
      max_results: 100, // Adjust as needed
    });
    res.json(result.resources); // Send video data to the client
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
// Route to delete a specific video
app.delete('/api/videos/:publicId', async (req, res) => {
    const { publicId } = req.params;
  
    try {
      // Call Cloudinary API to delete the video
      const result = await cloudinary.uploader.destroy(publicId, { resource_type: 'video' });
      
      if (result.result === 'ok') {
        res.json({ message: 'Video deleted successfully.' });
      } else {
        res.status(400).json({ error: 'Failed to delete video.' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  