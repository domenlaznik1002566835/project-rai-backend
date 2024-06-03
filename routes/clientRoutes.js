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
router.post('/login', clientController.login)

router.post('/clients/logout', clientController.logout);

router.post('/register-fcm-token', clientController.registerFCMToken);

app.post('/send-notification', clientController.sendNotification);


module.exports = router;
