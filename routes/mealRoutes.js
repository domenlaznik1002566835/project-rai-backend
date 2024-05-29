var express = require('express');
var router = express.Router();
var mealController = require('../controllers/mealController.js');
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
router.get('/', mealController.list);

/*
 * GET
 */
router.get('/:id', mealController.show);

/*
 * POST
 */
router.post('/', mealController.create);

/*
 * PUT
 */
router.put('/:id', mealController.update);

/*
 * DELETE
 */
router.delete('/:id', mealController.remove);

module.exports = router;
