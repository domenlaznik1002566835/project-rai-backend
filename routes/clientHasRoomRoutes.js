var express = require('express');
var router = express.Router();
var clientHasRoomController = require('../controllers/clientHasRoomController.js');

/*
 * GET
 */
router.get('/', clientHasRoomController.list);

/*
 * GET
 */
router.get('/:id', clientHasRoomController.show);

/*
 * POST
 */
router.post('/', clientHasRoomController.create);

/*
 * PUT
 */
router.put('/:id', clientHasRoomController.update);

/*
 * DELETE
 */
router.delete('/:id', clientHasRoomController.remove);

module.exports = router;
