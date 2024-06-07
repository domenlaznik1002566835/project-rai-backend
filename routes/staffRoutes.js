var express = require('express');
var router = express.Router();
var staffController = require('../controllers/staffController.js');

/*
 * GET
 */
router.get('/', staffController.list);

/*
 * GET
 */
router.get('/:id', staffController.show);
router.get('/email/:email', staffController.showByEmail);

/*
 * POST
 */
router.post('/', staffController.register);

/*
 * PUT
 */
router.put('/:id', staffController.update);

/*
 * DELETE
 */
router.delete('/:id', staffController.remove);

module.exports = router;
