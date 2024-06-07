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
    create: async function (req, res) {
        const existingPackage = await PackageModel.findOne({ code: req.body.code });

        if (existingPackage) {
            return res.status(400).json({
                message: 'A package with this code already exists.'
            });
        }

        var package = new PackageModel({
            code: req.body.code,
            openTimestamp: req.body.openTimestamp || null,
            closeTimestamp: req.body.closeTimestamp || null
        });

        try {
            const savedPackage = await package.save();
            return res.status(201).json(savedPackage);
        } catch (err) {
            return res.status(500).json({
                message: 'Error when creating package',
                error: err
            });
        }
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

            package.code = req.body.code ? req.body.code : package.code;
            package.openTimestamp = req.body.openTimestamp ? req.body.openTimestamp : package.openTimestamp;
            package.closeTimestamp = req.body.closeTimestamp ? req.body.closeTimestamp : package.closeTimestamp;
            
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
