var express = require('express');
var router = express.Router();
var roomHasPackageController = require('../controllers/roomHasPackageController.js');

/*
 * GET
 */
router.get('/', roomHasPackageController.list);

/*
 * GET
 */
router.get('/:id', roomHasPackageController.show);

/*
 * POST
 */
router.post('/', roomHasPackageController.create);

/*
 * PUT
 */
router.put('/:id', roomHasPackageController.update);

/*
 * DELETE
 */
router.delete('/:id', roomHasPackageController.remove);

module.exports = router;
