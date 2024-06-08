// routes/video2FARoutes.js
const express = require('express');
const router = express.Router();
const video2FAController = require('../controllers/video2FAController');

// Posodobljeni klic funkcije
router.post('/upload', video2FAController.uploadAndVerifyVideo);
router.get('/:id', video2FAController.getVideo);
router.post('/verify', video2FAController.verifyVideo);
router.post('/authenticate', video2FAController.authenticate);
router.post('/upload-video', video2FAController.uploadVideo);


module.exports = router;
