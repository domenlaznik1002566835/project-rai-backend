var express = require('express');
var router = express.Router();
var clientController = require('../controllers/clientController.js');
var requireLogin = require('../middleware/requireLogin.js');
var multer = require('multer');
var upload = multer({ dest: 'uploads/' });

/*
 * GET
 */
router.get('/', clientController.list);

/*
 * GET
 */
router.get('/:id', /*requireLogin,*/ clientController.show);

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

router.post('/clients/logout', clientController.logout);

router.post('/register-fcm-token', clientController.registerFCMToken);

router.post('/send-notification', clientController.sendNotification);

router.post('/login-web', clientController.login_web);
/*
 * POST video upload
 */
router.post('/upload-video', requireLogin, upload.single('video'), clientController.uploadVideo);

/*
 * POST start 2FA
 */
router.post('/start-2fa', requireLogin, clientController.start2FA);

/*
 * POST verify 2FA
 */
router.post('/verify-2fa', requireLogin, clientController.verify2FA);

router.post('/send-test-notification', clientController.sendTestNotification);


module.exports = router;
