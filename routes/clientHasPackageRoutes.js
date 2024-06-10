var express = require('express');
var router = express.Router();
var clientHasPackageController = require('../controllers/clientHasPackageController.js');

/*
 * GET
 */
router.get('/', clientHasPackageController.list);

/*
 * GET
 */
router.get('/:id', clientHasPackageController.show);
router.get('/all/:clientId', clientHasPackageController.getAllPackagesForClient);

/*
 * POST
 */
router.post('/', clientHasPackageController.create);
router.post('/access', clientHasPackageController.access);
/*
 * PUT
 */
router.put('/:id', clientHasPackageController.update);

/*
 * DELETE
 */
router.delete('/:id', clientHasPackageController.remove);

module.exports = router;
