var ClienthaspackageModel = require('../models/clientHasPackageModel.js');
var ClientModel = require('../models/clientModel');
var PackageModel = require('../models/packageModel');

/**
 * clientHasPackageController.js
 *
 * @description :: Server-side logic for managing clientHasPackages.
 */
module.exports = {

    /**
     * clientHasPackageController.list()
     */
    list: function (req, res) {
        ClienthaspackageModel.find(function (err, clientHasPackages) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting clientHasPackage.',
                    error: err
                });
            }

            return res.json(clientHasPackages);
        });
    },

    /**
     * clientHasPackageController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        ClienthaspackageModel.findOne({_id: id}, function (err, clientHasPackage) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting clientHasPackage.',
                    error: err
                });
            }

            if (!clientHasPackage) {
                return res.status(404).json({
                    message: 'No such clientHasPackage'
                });
            }

            return res.json(clientHasPackage);
        });
    },

    /**
     * clientHasPackageController.create()
     */
    /**
     * clientHasPackageController.create()
     */
    create: async function (req, res) {

        const {client, package, start, end} = req.body;

        var clientExists = await ClientModel.findOne({_id: client});
        if (!clientExists) {
            return res.status(404).json({
                message: 'No such client'
            });
        }

        var packageExists = await PackageModel.findOne({code: package});
        if (!packageExists) {
            return res.status(404).json({
                message: 'No such package'
            });
        }

        console.log("client: " + client + " package: " + package + " start: " + start + " end: " + end);

        try {
            var clientHasPackage = new ClienthaspackageModel({
                client : client,
                package : package,
                start : start,
                end : end
            });

            const newClientHasPackage = await clientHasPackage.save();
            return res.status(201).json(newClientHasPackage);
        } catch (err) {
            console.error(err); // Log the error details
            return res.status(500).json({
                message: 'Error when creating clientHasPackage',
                error: err
            });
        }
    },

    getAllPackagesForClient: async function (req, res) {
        var id = req.params.clientId;
        console.log("id: " + id);
        try {
            const clientHasPackages = await ClienthaspackageModel.find({client: id});
            if(!clientHasPackages || clientHasPackages.length === 0) {
                return res.status(404).json({
                    message: 'No packages found for this client'
                });
            }
            return res.json(clientHasPackages);
        } catch (err) {
            console.error(err);
            return res.status(500).json({
                message: 'Error when retrieving packages for client',
                error: err
            });
        }
    }
    ,
    access: async function (req, res) {
        const {client, code} = req.body;

        const clientHasPackage = await ClienthaspackageModel.findOne({client: client, package: code});

        if (!clientHasPackage) {
            return res.status(200).json({
                result: false
            });
        }

        const currentDate = new Date();
        const startDate = new Date(clientHasPackage.start);
        const endDate = new Date(clientHasPackage.end);

        if (currentDate >= startDate && currentDate <= endDate) {
            return res.status(200).json({
                result: true
            });
        } else {
            return res.status(200).json({
                result: false
            });
        }
    }
    ,

    /**
     * clientHasPackageController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        ClienthaspackageModel.findOne({_id: id}, function (err, clientHasPackage) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting clientHasPackage',
                    error: err
                });
            }

            if (!clientHasPackage) {
                return res.status(404).json({
                    message: 'No such clientHasPackage'
                });
            }

            clientHasPackage.client = req.body.client ? req.body.client : clientHasPackage.client;
			clientHasPackage.package = req.body.package ? req.body.package : clientHasPackage.package;
			clientHasPackage.start = req.body.start ? req.body.start : clientHasPackage.start;
			clientHasPackage.end = req.body.end ? req.body.end : clientHasPackage.end;
			
            clientHasPackage.save(function (err, clientHasPackage) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating clientHasPackage.',
                        error: err
                    });
                }

                return res.json(clientHasPackage);
            });
        });
    },

    /**
     * clientHasPackageController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        ClienthaspackageModel.findByIdAndRemove(id, function (err, clientHasPackage) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the clientHasPackage.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    }
};
