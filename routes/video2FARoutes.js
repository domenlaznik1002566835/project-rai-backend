const express = require('express');
const router = express.Router();
const video2FAController = require('../controllers/video2FAController');

router.post('/upload', video2FAController.uploadVideo);
router.get('/:id', video2FAController.getVideo);
router.post('/verify', video2FAController.verifyVideo);
router.post('/authenticate', video2FAController.authenticate);

module.exports = router;
