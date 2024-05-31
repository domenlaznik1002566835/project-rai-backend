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
router.get('/:id', /*requireLogin,*/ clientController.show);

/*
 * POST
 */
router.post('/', clientController.register);

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

module.exports = router;
