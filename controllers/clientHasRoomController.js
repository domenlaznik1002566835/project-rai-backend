var ClienthasroomModel = require('../models/clientHasRoomModel.js');

/**
 * clientHasRoomController.js
 *
 * @description :: Server-side logic for managing clientHasRooms.
 */
module.exports = {

    /**
     * clientHasRoomController.list()
     */
    list: function (req, res) {
        ClienthasroomModel.find(function (err, clientHasRooms) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting clientHasRoom.',
                    error: err
                });
            }

            return res.json(clientHasRooms);
        });
    },

    /**
     * clientHasRoomController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        ClienthasroomModel.findOne({_id: id}, function (err, clientHasRoom) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting clientHasRoom.',
                    error: err
                });
            }

            if (!clientHasRoom) {
                return res.status(404).json({
                    message: 'No such clientHasRoom'
                });
            }

            return res.json(clientHasRoom);
        });
    },

    /**
     * clientHasRoomController.create()
     */
    create: function (req, res) {
        var clientHasRoom = new ClienthasroomModel({
			clientId : req.body.clientId,
			roomId : req.body.roomId,
			contractCreated : req.body.contractCreated,
			contractEnds : req.body.contractEnds
        });

        clientHasRoom.save(function (err, clientHasRoom) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating clientHasRoom',
                    error: err
                });
            }

            return res.status(201).json(clientHasRoom);
        });
    },

    /**
     * clientHasRoomController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        ClienthasroomModel.findOne({_id: id}, function (err, clientHasRoom) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting clientHasRoom',
                    error: err
                });
            }

            if (!clientHasRoom) {
                return res.status(404).json({
                    message: 'No such clientHasRoom'
                });
            }

            clientHasRoom.clientId = req.body.clientId ? req.body.clientId : clientHasRoom.clientId;
			clientHasRoom.roomId = req.body.roomId ? req.body.roomId : clientHasRoom.roomId;
			clientHasRoom.contractCreated = req.body.contractCreated ? req.body.contractCreated : clientHasRoom.contractCreated;
			clientHasRoom.contractEnds = req.body.contractEnds ? req.body.contractEnds : clientHasRoom.contractEnds;
			
            clientHasRoom.save(function (err, clientHasRoom) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating clientHasRoom.',
                        error: err
                    });
                }

                return res.json(clientHasRoom);
            });
        });
    },

    /**
     * clientHasRoomController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        ClienthasroomModel.findByIdAndRemove(id, function (err, clientHasRoom) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the clientHasRoom.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    }
};
