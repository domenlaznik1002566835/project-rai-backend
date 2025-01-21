const axios = require('axios');
const Video2FAModel = require('../models/video2FA');
const ClientModel = require('../models/clientModel');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const FormData = require('form-data');
const flask_ip = require('../flask_ip');
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


exports.uploadVideo = async function (req, res) {
  console.log("Starting video upload process...");

  upload.single('video')(req, res, async function (err) {
      if (err) {
          console.log("Error uploading video:", err);
          return res.status(500).json({ message: 'Error uploading video', error: err });
      }

      const filePath = req.file.path.replace(/\\/g, '/');  
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

          // Create form data for sending the file
          const form = new FormData();
          form.append('file', fs.createReadStream(filePath));

          const flaskApiUrl = `${process.env.FLASK_IP}/process_video`;
              const response = await axios.post(flaskApiUrl, form, {
              headers: form.getHeaders() 
          });

          console.log("Response from Flask API:", response.data);

          if (response.status === 200 && response.data.success) {
              console.log("Video processed successfully by Flask API");
              return res.status(200).json({ 
                  message: 'Video uploaded and processed successfully', 
                  result: response.data 
              });
          } else {
              console.log("Error processing video with Flask API:", response.data);
              return res.status(400).json({ 
                  message: 'Error processing video with Flask API', 
                  error: response.data 
              });
          }
      } catch (err) {
          console.log("Error saving video to the database or processing video:", err);
          return res.status(500).json({ 
              message: 'Error saving video or processing video', 
              error: err 
          });
      }
  });
};