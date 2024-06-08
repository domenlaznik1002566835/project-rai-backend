const axios = require('axios');
const Video2FAModel = require('../models/video2FA');
const ClientModel = require('../models/clientModel');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
require('dotenv').config();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage: storage });

// Middleware to handle video upload and verify clientId
exports.uploadAndVerifyVideo = [
  upload.single('video'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).send('No file uploaded.');
      }

      const { clientId } = req.body;
      if (!clientId) {
        return res.status(400).send('No client ID provided.');
      }

      if (!mongoose.Types.ObjectId.isValid(clientId)) {
        return res.status(400).send('Invalid Client ID format.');
      }

      const client = await ClientModel.findById(clientId);
      if (!client) {
        return res.status(404).send('Client not found.');
      }

      const video2FA = new Video2FAModel({
        client: client._id,
        videoPath: req.file.path
      });

      await video2FA.save();

      client.video2FAs.push(video2FA._id);
      await client.save();

      // Send request to Flask app for video verification
      const response = await axios.post('http://localhost:5000/verify_video', {
        video_filename: path.basename(req.file.path),
        client_id: clientId
      });

      res.status(200).send(response.data.result);
    } catch (error) {
      console.error('Error processing video:', error);
      res.status(500).send('Error processing video.');
    }
  }
];

// Function to retrieve video by ID
exports.getVideo = async (req, res) => {
  try {
    const video2FA = await Video2FAModel.findById(req.params.id);
    if (!video2FA) {
      return res.status(404).send('Video not found.');
    }

    const videoPath = video2FA.videoPath;
    if (!fs.existsSync(videoPath)) {
      return res.status(404).send('Video file not found.');
    }

    res.sendFile(path.resolve(videoPath));
  } catch (error) {
    console.error('Error retrieving video:', error);
    res.status(500).send('Error retrieving video.');
  }
};

// Function to verify video
exports.verifyVideo = async (req, res) => {
  const { videoPath, clientId } = req.body;

  if (!videoPath || !clientId) {
    return res.status(400).send('Missing required fields.');
  }

  if (!mongoose.Types.ObjectId.isValid(clientId)) {
    return res.status(400).send('Invalid Client ID format.');
  }

  try {
    const response = await axios.post('http://localhost:5000/verify_video', {
      video_filename: path.basename(videoPath),
      client_id: clientId
    });

    res.status(200).send(response.data.result);
  } catch (error) {
    console.error('Error verifying video:', error);
    res.status(500).send('Error verifying video.');
  }
};

// Function to authenticate user
exports.authenticate = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await ClientModel.authenticate(email, password);
    const token = jwt.sign({ _id: user._id }, process.env.SESSION_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token });
  } catch (error) {
    res.status(401).send(error.message);
  }
};

// Function for uploading video
exports.uploadVideo = async function (req, res) {
  console.log("Starting video upload process...");
exports.uploadVideo = async function (req, res) {
  console.log("Starting video upload process...");

  upload.single('video')(req, res, async function (err) {
      if (err) {
          console.log("Error uploading video:", err);
          return res.status(500).json({ message: 'Error uploading video', error: err });
      }

      const filePath = req.file.path;
      console.log("Video upload completed. File info:", req.file);
      console.log("Video file path:", filePath);

      const userId = req.body.userId;
      if (!mongoose.Types.ObjectId.isValid(userId)) {
          console.log("No valid userId provided");
          return res.status(400).json({ message: 'No valid userId provided' });
      }

      console.log("Received userId:", userId);

      try {
          console.log("Saving video info to the database...");
          const video2FA = new Video2FAModel({
              client: new mongoose.Types.ObjectId(userId),
              videoPath: filePath
          });
          await video2FA.save();
          console.log("Video info saved successfully");
          return res.status(200).json({ message: 'Video uploaded successfully' });
      } catch (err) {
          console.log("Error saving video to the database:", err);
          return res.status(500).json({ message: 'Error saving video', error: err });
      }
  });
};