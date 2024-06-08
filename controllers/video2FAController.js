// controllers/video2FAController.js
const axios = require('axios');
const Video2FAModel = require('../models/video2FA');
const ClientModel = require('../models/clientModel');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Konfiguracija za nalaganje datotek z uporabo multerja
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage: storage });

// Funkcija za nalaganje videoposnetka in preverjanje identitete
exports.uploadAndVerifyVideo = [
  upload.single('video'),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }

    /*const { clientId } = req.body;
    if (!clientId) {
      return res.status(400).send('No client ID provided.');
    }*/

    try {
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

      // Pošljemo zahtevo Flask aplikaciji za preverjanje videoposnetka
      const response = await axios.post('http://localhost:5000/verify_video', {
        video_filename: path.basename(req.file.path),
        client_id: clientId
      });

      res.status(200).send(response.data.result);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error processing video.');
    }
  }
];

// Funkcija za pridobivanje videoposnetka
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
    console.error(error);
    res.status(500).send('Error retrieving video.');
  }
};

// Funkcija za preverjanje videoposnetka
exports.verifyVideo = async (req, res) => {
  const { videoPath, clientId } = req.body;

  if (!videoPath || !clientId) {
    return res.status(400).send('Missing required fields.');
  }

  try {
    const response = await axios.post('http://localhost:5000/verify_video', {
      video_filename: path.basename(videoPath),
      client_id: clientId
    });

    res.status(200).send(response.data.result);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error verifying video.');
  }
};

// Funkcija za avtentikacijo uporabnika
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

exports.uploadVideo = async function (req, res) {
  console.log('Starting video upload process...');

  upload.single('video')(req, res, async function (err) {
    if (err) {
      console.error('Error uploading video:', err);
      return res.status(500).json({ message: 'Error uploading video', error: err });
    }

    console.log('Video upload completed. File info:', req.file);

    if (!req.file) {
      console.error('No file uploaded.');
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    const filePath = req.file.path;
    console.log('Video file path:', filePath);

    try {
      console.log('Saving video info to the database...');
      const video2FA = new Video2FAModel({
        // client: userId, // Removed the userId field
        videoPath: filePath
      });
      await video2FA.save();
      console.log('Video info saved successfully.');
      return res.status(200).json({ message: 'Video uploaded successfully' });
    } catch (err) {
      console.error('Error saving video to the database:', err);
      return res.status(500).json({ message: 'Error saving video', error: err });
    }
  });
};