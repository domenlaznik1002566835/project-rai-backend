var ClientModel = require('../models/clientModel.js');
var StaffModel = require('../models/staffModel.js');

/**
 * clientController.js
 *
 * @description :: Server-side logic for managing clients.
 */
module.exports = {

    /**
     * clientController.list()
     */
    list: async function (req, res) {
        try {
            const clients = await ClientModel.find().sort({created: -1});
            return res.json(clients);
        } catch (err) {
            return res.status(500).json({
                message: 'Error when getting client.',
                error: err
            });
        }
    },

    /**
     * clientController.show()
     */
    show: async function (req, res) {
        var id = req.params.id;

        try {
            const staff = await ClientModel.findOne({_id: id});
            if (!staff) {
                return res.status(404).json({
                    message: 'No such client'
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

    /**
     * clientController.create()
     */
    register: async function (req, res) {
        const {firstName, lastName, email, password} = req.body;

        let emailExists = await ClientModel.findOne({email: email});
        if (emailExists) {
            return res.status(400).json({error: 1, message: "Email already exists"});
        }
        let emailStaffExists = await StaffModel.findOne({email: email});
        if (emailStaffExists) {
            return res.status(400).json({error: 1, message: "Email already exists"});
        }
        const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({error: 1, message: "Invalid email format"});
        }

        const client = new ClientModel({
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: password
            }
        );

        try {
            await client.save();
            return res.json(client);
        } catch (err) {
            return res.status(500).json({
                message: 'Error when creating client',
                error: err
            });
        }
    }
    ,
    /**
     * clientController.update()
     */
    update: async function (req, res) {
        var id = req.params.id;
        try {
            let client = await ClientModel.findOne({ _id: id });

            if (!client) {
                return res.status(404).json({
                    message: 'No such client'
                });
            }

            client.firstName = req.body.firstName ? req.body.firstName : client.firstName;
            client.lastName = req.body.lastName ? req.body.lastName : client.lastName;
            client.email = req.body.email ? req.body.email : client.email;
            client.username = req.body.username ? req.body.username : client.username;
            client.password = req.body.password ? req.body.password : client.password;

            await client.save();
            return res.json(client);
        } catch (err) {
            return res.status(500).json({
                message: 'Error when updating client.',
                error: err
            });
        }
    },

    /**
     * clientController.remove()
     */
    remove: async function (req, res) {
        var id = req.params.id;
        try {
            const client = await ClientModel.findByIdAndRemove(id);
            if (!client) {
                return res.status(404).json({
                    message: 'No such client'
                });
            }

            if (req.session.userId === id) {
                req.session.destroy(function (err) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Error when destroying session.',
                            error: err
                        });
                    }

                    return res.status(204).json();
                });
            } else {
                return res.status(204).json();
            }
        } catch (err) {
            return res.status(500).json({
                message: 'Error when deleting the client.',
                error: err
            });
        }
    },
    login: async function (req, res, next) {
        const {email, password} = req.body;
        try {
            const client = await ClientModel.authenticate(email, password);
            req.session.userId = client._id;
            return res.json(client);
        } catch (err) {
            return res.status(401).json({
                message: 'Invalid email or password',
                error: err
            });
        }
    },
};
