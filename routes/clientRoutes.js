var express = require('express');
var router = express.Router();
var clientController = require('../controllers/clientController.js');
var requireLogin = require('../middleware/requireLogin.js');

/*
 * GET
 */
router.get('/', clientController.list);

/*
 * GET
 */
router.get('/:id', requireLogin, clientController.show);

/*
 * POST
 */
router.post('/', clientController.create);

/*
 * PUT
 */
router.put('/:id', requireLogin, clientController.update);

/*
 * DELETE
 */
router.delete('/:id', requireLogin, clientController.remove);

/*
 * POST login
 */
router.post('/login', clientController.login);

/*
 * POST logout
 */
router.post('/logout', requireLogin, clientController.logout);

/*
 * POST register FCM token
 */
router.post('/register-fcm-token', requireLogin, clientController.registerFCMToken);

/*
 * POST send notification
 */
router.post('/send-notification', requireLogin, clientController.sendNotification);

/*
 * POST start 2FA
 */
router.post('/start-2fa', requireLogin, clientController.start2FA);

/*
 * POST upload video
 */
router.post('/upload-video', requireLogin, clientController.uploadVideo);

/*
 * POST verify 2FA
 */
router.post('/verify-2fa', requireLogin, clientController.verify2FA);

module.exports = router;
