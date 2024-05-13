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
    list: function (req, res) {
        ClientModel.find(function (err, clients) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting client.',
                    error: err
                });
            }

            return res.json(clients);
        });
    },

    /**
     * clientController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        ClientModel.findOne({_id: id}, function (err, client) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting client.',
                    error: err
                });
            }

            if (!client) {
                return res.status(404).json({
                    message: 'No such client'
                });
            }

            return res.json(client);
        });
    },

    /**
     * clientController.create()
     */
    create: function (req, res) {
        var client = new ClientModel({
			id : req.body.id,
			firstName : req.body.firstName,
			lastName : req.body.lastName,
			email : req.body.email,
			password : req.body.password
        });

        client.save(function (err, client) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating client',
                    error: err
                });
            }

            return res.status(201).json(client);
        });
    },

    /**
     * clientController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        ClientModel.findOne({_id: id}, function (err, client) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting client',
                    error: err
                });
            }

            if (!client) {
                return res.status(404).json({
                    message: 'No such client'
                });
            }

            client.id = req.body.id ? req.body.id : client.id;
			client.firstName = req.body.firstName ? req.body.firstName : client.firstName;
			client.lastName = req.body.lastName ? req.body.lastName : client.lastName;
			client.email = req.body.email ? req.body.email : client.email;
			client.password = req.body.password ? req.body.password : client.password;
			
            client.save(function (err, client) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating client.',
                        error: err
                    });
                }

                return res.json(client);
            });
        });
    },

    /**
     * clientController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        ClientModel.findByIdAndRemove(id, function (err, client) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the client.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    }
};
