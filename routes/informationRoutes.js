var express = require('express');
var router = express.Router();
var informationController = require('../controllers/informationController.js');
const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/news/')
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({ storage: storage });

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
router.post('/', upload.single('image'), informationController.create);

/*
 * PUT
 */
router.put('/:id', informationController.update);

/*
 * DELETE
 */
router.delete('/:id', informationController.remove);

module.exports = router;
