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
    list: async function (req, res) {
        try {
            const clients = await InformationModel.find().sort('-created');
            return res.json(clients);
        } catch (err) {
            return res.status(500).json({
                message: 'Error when getting client.',
                error: err
            });
        }
    },

    /**
     * informationController.show()
     */
    show: async function (req, res) {
        var id = req.params.id;

        try {
            const information = await InformationModel.findOne({_id: id});

            if (!information) {
                return res.status(404).json({
                    message: 'No such information'
                });
            }

            return res.json(information);
        } catch (err) {
            return res.status(500).json({
                message: 'Error when getting information.',
                error: err
            });
        }
    },

    /**
     * informationController.create()
     */
    create: async function (req, res) {
        const {title, text} = req.body;

        var imagePath = null;

        if(req.file) {
            imagePath = req.file.path;
        }

        const information = new InformationModel({
            title: title,
            text: text,
            image: imagePath,
            date: Date.now()
        });

        try {
            information.save();
            return res.json(information);
        } catch (err) {
            return res.status(500).json({
                message: 'Error when creating information',
                error: err
            });
        }
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
