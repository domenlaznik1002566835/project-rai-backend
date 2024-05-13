var RoomhaspackageModel = require('../models/roomHasPackageModel.js');

/**
 * roomHasPackageController.js
 *
 * @description :: Server-side logic for managing roomHasPackages.
 */
module.exports = {

    /**
     * roomHasPackageController.list()
     */
    list: function (req, res) {
        RoomhaspackageModel.find(function (err, roomHasPackages) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting roomHasPackage.',
                    error: err
                });
            }

            return res.json(roomHasPackages);
        });
    },

    /**
     * roomHasPackageController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        RoomhaspackageModel.findOne({_id: id}, function (err, roomHasPackage) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting roomHasPackage.',
                    error: err
                });
            }

            if (!roomHasPackage) {
                return res.status(404).json({
                    message: 'No such roomHasPackage'
                });
            }

            return res.json(roomHasPackage);
        });
    },

    /**
     * roomHasPackageController.create()
     */
    create: function (req, res) {
        var roomHasPackage = new RoomhaspackageModel({
			roomId : req.body.roomId,
			packageId : req.body.packageId
        });

        roomHasPackage.save(function (err, roomHasPackage) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating roomHasPackage',
                    error: err
                });
            }

            return res.status(201).json(roomHasPackage);
        });
    },

    /**
     * roomHasPackageController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        RoomhaspackageModel.findOne({_id: id}, function (err, roomHasPackage) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting roomHasPackage',
                    error: err
                });
            }

            if (!roomHasPackage) {
                return res.status(404).json({
                    message: 'No such roomHasPackage'
                });
            }

            roomHasPackage.roomId = req.body.roomId ? req.body.roomId : roomHasPackage.roomId;
			roomHasPackage.packageId = req.body.packageId ? req.body.packageId : roomHasPackage.packageId;
			
            roomHasPackage.save(function (err, roomHasPackage) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating roomHasPackage.',
                        error: err
                    });
                }

                return res.json(roomHasPackage);
            });
        });
    },

    /**
     * roomHasPackageController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        RoomhaspackageModel.findByIdAndRemove(id, function (err, roomHasPackage) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the roomHasPackage.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    }
};
