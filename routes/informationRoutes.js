var express = require('express');
var router = express.Router();
var informationController = require('../controllers/informationController.js');
const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/meals');
    },
    filename: function(req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname.replace(ext, '') + ext);
    }
});

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
