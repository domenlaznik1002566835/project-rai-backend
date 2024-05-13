var express = require('express');
var router = express.Router();
var clientController = require('../controllers/clientController.js');

/*
 * GET
 */
router.get('/', clientController.list);

/*
 * GET
 */
router.get('/:id', clientController.show);

/*
 * POST
 */
router.post('/', clientController.create);

/*
 * PUT
 */
router.put('/:id', clientController.update);

/*
 * DELETE
 */
router.delete('/:id', clientController.remove);

module.exports = router;
