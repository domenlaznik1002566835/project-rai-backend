var StaffModel = require('../models/staffModel.js');

/**
 * staffController.js
 *
 * @description :: Server-side logic for managing staffs.
 */
module.exports = {

    /**
     * staffController.list()
     */
    list: function (req, res) {
        StaffModel.find(function (err, staffs) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting staff.',
                    error: err
                });
            }

            return res.json(staffs);
        });
    },

    /**
     * staffController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        StaffModel.findOne({_id: id}, function (err, staff) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting staff.',
                    error: err
                });
            }

            if (!staff) {
                return res.status(404).json({
                    message: 'No such staff'
                });
            }

            return res.json(staff);
        });
    },

    /**
     * staffController.create()
     */
    create: async function (req, res) {
        const {firstName, lastName, username, password, level} = req.body;

        if(level !== 0 || level !== 1) {
            return res.status(400).json({error: 1, message: "Invalid staff level"});
        }

        const staff = new StaffModel({
            firstName: firstName,
            lastName: lastName,
            username: username,
            password: password,
            level: level
        });

        try {
            await staff.save();
            return res.json(staff);
        } catch(err) {
            return res.status(500).json({
                message: 'Error when creating staff',
                error: err
            });
        }
    },

    /**
     * staffController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        StaffModel.findOne({_id: id}, function (err, staff) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting staff',
                    error: err
                });
            }

            if (!staff) {
                return res.status(404).json({
                    message: 'No such staff'
                });
            }

            staff.id = req.body.id ? req.body.id : staff.id;
			staff.firstName = req.body.firstName ? req.body.firstName : staff.firstName;
			staff.lastName = req.body.lastName ? req.body.lastName : staff.lastName;
			staff.username = req.body.username ? req.body.username : staff.username;
			staff.password = req.body.password ? req.body.password : staff.password;
			staff.level = req.body.level ? req.body.level : staff.level;
			
            staff.save(function (err, staff) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating staff.',
                        error: err
                    });
                }

                return res.json(staff);
            });
        });
    },

    /**
     * staffController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        StaffModel.findByIdAndRemove(id, function (err, staff) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the staff.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    }
};
