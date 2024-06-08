var PackageLogsModel = require('../models/packageLogsModel.js');
var ClientModel = require('../models/clientModel');
var StaffModel = require('../models/staffModel');
var ClientHasPackageModel = require('../models/clientHasPackageModel.js');

/**
 * packageLogsController.js
 *
 * @description :: Server-side logic for managing package-logss.
 */
module.exports = {

    /**
     * package-logsController.list()
     */
    list: function (req, res) {
        PackageLogsModel.find(function (err, packageLogs) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting package-logs.',
                    error: err
                });
            }

            return res.json(packageLogs);
        });
    },

    /**
     * package-logsController.show()
     */
    show: async function (req, res) {
        var id = req.params.id;
        var currentDate = new Date();

        var clientPackages = await ClientHasPackageModel.find({
            'client': id,
            'start': { $lte: currentDate },
            'end': { $gte: currentDate }
        });

        if (!clientPackages || clientPackages.length === 0) {
            return res.status(404).json({
                message: 'No such client or package'
            });
        }

        var allPackageLogs = [];
        for (let clientPackage of clientPackages) {
            var packageLogs = await PackageLogsModel.find({
                'code': clientPackage.package,
                'date': { $gte: clientPackage.start, $lte: clientPackage.end }
            });

            if (packageLogs && packageLogs.length > 0) {
                allPackageLogs.push(...packageLogs);
            }
        }

        if (allPackageLogs.length === 0) {
            return res.status(404).json({
                message: 'No package logs found'
            });
        }

        console.log(allPackageLogs);

        return res.json(allPackageLogs);
    },

    /**
     * package-logsController.create()
     */
    create: async function (req, res) {
        const {code, openedBy, type } = req.body;
        console.log("Opened by: " + openedBy);
        var client = await ClientModel.findOne({_id: openedBy});
        if (!client) {
            client = await StaffModel.findOne({_id: openedBy});
            if(!client){
                return res.status(404).json({
                    message: 'No such client or staff'
                });
            }
        }
        const clientName = client.firstName + " " + client.lastName;
        try{
            var packageLogs = new PackageLogsModel({
                code : code,
                openedBy : clientName,
                type : type,
                date : new Date()
            });

            await packageLogs.save();

            return res.status(201).json(packageLogs);
        }
        catch (err) {
            return res.status(500).json({
                message: 'Error when creating package-logs',
                error: err
            });
        }
    },

    /**
     * package-logsController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        PackageLogsModel.findOne({_id: id}, function (err, packageLogs) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting package-logs',
                    error: err
                });
            }

            if (!packageLogs) {
                return res.status(404).json({
                    message: 'No such package-logs'
                });
            }

            packageLogs.package = req.body.package ? req.body.package : package-logs.package;
            packageLogs.openedBy = req.body.openedBy ? req.body.openedBy : package-logs.openedBy;
            packageLogs.type = req.body.type ? req.body.type : package-logs.type;
            packageLogs.date = req.body.date ? req.body.date : package-logs.date;

            packageLogs.save(function (err, packageLogs) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating package-logs.',
                        error: err
                    });
                }

                return res.json(packageLogs);
            });
        });
    },

    /**
     * package-logsController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        PackageLogsModel.findByIdAndRemove(id, function (err, packageLogs) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the package-logs.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    }
};
