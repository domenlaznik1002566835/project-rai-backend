var express = require('express');
var router = express.Router();
var informationController = require('../controllers/informationController.js');

/*
 * GET
 */
router.get('/', informationController.list);

/*
 * GET
 */
router.get('/:id', informationController.show);

/*
 * POST
 */
router.post('/', informationController.create);

/*
 * PUT
 */
router.put('/:id', informationController.update);

/*
 * DELETE
 */
router.delete('/:id', informationController.remove);

module.exports = router;
