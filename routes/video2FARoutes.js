const express = require('express');
const router = express.Router();
const video2FAController = require('../controllers/video2FAController');

router.post('/upload-video', video2FAController.uploadVideo);

module.exports = router;
