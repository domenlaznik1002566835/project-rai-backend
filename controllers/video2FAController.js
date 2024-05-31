const Video2FAModel = require('../models/video2FA');
const ClientModel = require('../models/clientModel');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
const jwt = require('jsonwebtoken');
require('dotenv').config(); 

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage: storage });

exports.uploadVideo = [
  upload.single('video'),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }

    const { clientId } = req.body;
    if (!clientId) {
      return res.status(400).send('No client ID provided.');
    }

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

      res.status(200).send('Video saved successfully.');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error saving video.');
    }
  }
];

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

exports.verifyVideo = async (req, res) => {
  const { videoPath, clientId } = req.body;

  if (!videoPath || !clientId) {
    return res.status(400).send('Missing required fields.');
  }

  try {
    const process = spawn('python3', ['path/to/your/verify_script.py', videoPath, clientId]);

    process.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
      res.status(200).send(data.toString());
    });

    process.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
      res.status(500).send('Error verifying video.');
    });
  } catch (error) {
    console.error(error); 
    res.status(500).send('Error processing verification.');
  }
};


exports.authenticate = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await ClientModel.authenticate(email, password);
    const token = jwt.sign({ _id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (error) {
    res.status(401).send(error.message);
  }
};
