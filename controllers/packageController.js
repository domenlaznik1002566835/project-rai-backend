var PackageModel = require('../models/packageModel.js');

/**
 * packageController.js
 *
 * @description :: Server-side logic for managing packages.
 */
module.exports = {

    /**
     * packageController.list()
     */
    list: function (req, res) {
        PackageModel.find(function (err, packages) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting package.',
                    error: err
                });
            }

            return res.json(packages);
        });
    },

    /**
     * packageController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        PackageModel.findOne({_id: id}, function (err, package) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting package.',
                    error: err
                });
            }

            if (!package) {
                return res.status(404).json({
                    message: 'No such package'
                });
            }

            return res.json(package);
        });
    },

    /**
     * packageController.create()
     */
    create: function (req, res) {
        var package = new PackageModel({
			id : req.body.id,
			code : req.body.code
        });

        package.save(function (err, package) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating package',
                    error: err
                });
            }

            return res.status(201).json(package);
        });
    },

    /**
     * packageController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        PackageModel.findOne({_id: id}, function (err, package) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting package',
                    error: err
                });
            }

            if (!package) {
                return res.status(404).json({
                    message: 'No such package'
                });
            }

            package.id = req.body.id ? req.body.id : package.id;
			package.code = req.body.code ? req.body.code : package.code;
			
            package.save(function (err, package) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating package.',
                        error: err
                    });
                }

                return res.json(package);
            });
        });
    },

    /**
     * packageController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        PackageModel.findByIdAndRemove(id, function (err, package) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the package.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    }
};
