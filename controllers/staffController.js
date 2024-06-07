var StaffModel = require('../models/staffModel.js');
const ClientModel = require("../models/clientModel");

/**
 * staffController.js
 *
 * @description :: Server-side logic for managing staffs.
 */
module.exports = {

    /**
     * staffController.list()
     */
    list: async function (req, res) {
        try {
            const staff = await StaffModel.find().sort({level: 1, created: -1});
            return res.json(staff);
        } catch (err) {
            return res.status(500).json({
                message: 'Error when getting client.',
                error: err
            });
        }
    },

    /**
     * staffController.show()
     */
    show: async function (req, res) {
        var id = req.params.id;

        try {
            const staff = await StaffModel.findOne({_id: id});
            if (!staff) {
                return res.status(404).json({
                    message: 'No such staff'
                });
            }

            return res.json(staff);
        } catch (err) {
            return res.status(500).json({
                message: 'Error when getting staff.',
                error: err
            });
        }
    },

    showByEmail: async function (req, res) {
        var email = req.params.email;

        try {
            const staff = await StaffModel.findOne({email: email});
            if (!staff) {
                return res.status(404).json({
                    message: 'No such staff'
                });
            }

            return res.json(staff);
        } catch (err) {
            return res.status(500).json({
                message: 'Error when getting staff.',
                error: err
            });
        }
    }
    ,
    /**
     * staffController.create()
     */
    register: async function (req, res) {
        const {firstName, lastName, email, password, level} = req.body;

        let emailExists = await ClientModel.findOne({email: email});
        if (emailExists) {
            return res.status(400).json({error: 1, message: "A client with this email already exists"});
        }
        let emailStaffExists = await StaffModel.findOne({email: email});
        if (emailStaffExists) {
            return res.status(400).json({error: 1, message: "A staff member with this email already exists"});
        }
        const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({error: 1, message: "Invalid email format"});
        }
        if(level !== 0 && level !== 1 && level !== 2 && level !== 3) {
            return res.status(400).json({error: 1, message: "Invalid staff level"});
        }

        const staff = new StaffModel({
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: password,
                level: level
            }
        );

        try {
            await staff.save();
            return res.json(staff);
        } catch (err) {
            return res.status(500).json({
                message: 'Error when creating staff',
                error: err
            });
        }
    }
    ,

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
