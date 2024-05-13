var InformationModel = require('../models/informationModel.js');

/**
 * informationController.js
 *
 * @description :: Server-side logic for managing informations.
 */
module.exports = {

    /**
     * informationController.list()
     */
    list: function (req, res) {
        InformationModel.find(function (err, informations) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting information.',
                    error: err
                });
            }

            return res.json(informations);
        });
    },

    /**
     * informationController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        InformationModel.findOne({_id: id}, function (err, information) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting information.',
                    error: err
                });
            }

            if (!information) {
                return res.status(404).json({
                    message: 'No such information'
                });
            }

            return res.json(information);
        });
    },

    /**
     * informationController.create()
     */
    create: function (req, res) {
        var information = new InformationModel({
			title : req.body.title,
			text : req.body.text,
			image : req.body.image,
			date : req.body.date
        });

        information.save(function (err, information) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating information',
                    error: err
                });
            }

            return res.status(201).json(information);
        });
    },

    /**
     * informationController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        InformationModel.findOne({_id: id}, function (err, information) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting information',
                    error: err
                });
            }

            if (!information) {
                return res.status(404).json({
                    message: 'No such information'
                });
            }

            information.title = req.body.title ? req.body.title : information.title;
			information.text = req.body.text ? req.body.text : information.text;
			information.image = req.body.image ? req.body.image : information.image;
			information.date = req.body.date ? req.body.date : information.date;
			
            information.save(function (err, information) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating information.',
                        error: err
                    });
                }

                return res.json(information);
            });
        });
    },

    /**
     * informationController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        InformationModel.findByIdAndRemove(id, function (err, information) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the information.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    }
};
