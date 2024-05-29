var ClientModel = require('../models/clientModel.js');

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
            const clients = await ClientModel.find();
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
            const client = await ClientModel.findOne({ _id: id });
            if (!client) {
                return res.status(404).json({
                    message: 'No such client'
                });
            }
            return res.json(client);
        } catch (err) {
            return res.status(500).json({
                message: 'Error when getting client.',
                error: err
            });
        }
    },

    /**
     * clientController.create()
     */
    register: async function (req, res) {
        const {firstName, lastName, email, username, password} = req.body;

        let userExists = await ClientModel.findOne({username});
        if (userExists) {
            return res.status(400).json({error: "Username already exists"});
        }
        let emailExists = await ClientModel.findOne({email: x});
        if (emailExists) {
            return res.status(400).json({error: "Email already exists"});
        }

        const client = new ClientModel({
                firstName: firstName,
                lastName: lastName,
                email: email,
                username: username,
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
            try {
                const user = await ClientModel.authenticate(req.body.email, req.body.password);
                req.session.userId = user._id;
                return res.json(user);
            } catch (err) {
                var error = new Error('Wrong email or password');
                error.status = 401;
                return next(error);
            }
        },
};
