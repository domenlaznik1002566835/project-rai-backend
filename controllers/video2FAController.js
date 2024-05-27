const Video2FAModel = require('../models/video2FA');
const ClientModel = require('../models/clientModel');
const multer = require('multer');
const path = require('path');

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
      res.status(500).send('Error retrieving video.');
    }
  };