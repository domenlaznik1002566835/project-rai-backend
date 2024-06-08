var express = require('express');
var router = express.Router();
var packageLogsController = require('../controllers/packageLogsController.js');

/*
 * GET
 */
router.get('/', packageLogsController.list);

/*
 * GET
 */
router.get('/:id', packageLogsController.show);

/*
 * POST
 */
router.post('/', packageLogsController.create);

/*
 * PUT
 */
router.put('/:id', packageLogsController.update);

/*
 * DELETE
 */
router.delete('/:id', packageLogsController.remove);

module.exports = router;
