// routes/video2FARoutes.js

const express = require('express');
const router = express.Router();
const video2FAController = require('../controllers/video2FAController');

router.post('/upload', video2FAController.uploadVideo);

module.exports = router;
