var RoomModel = require('../models/roomModel.js');

/**
 * roomController.js
 *
 * @description :: Server-side logic for managing rooms.
 */
module.exports = {

    /**
     * roomController.list()
     */
    list: function (req, res) {
        RoomModel.find(function (err, rooms) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting room.',
                    error: err
                });
            }

            return res.json(rooms);
        });
    },

    /**
     * roomController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        RoomModel.findOne({_id: id}, function (err, room) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting room.',
                    error: err
                });
            }

            if (!room) {
                return res.status(404).json({
                    message: 'No such room'
                });
            }

            return res.json(room);
        });
    },

    /**
     * roomController.create()
     */
    create: async function (req, res) {
        const {number, size, type} = req.body;

        let roomExists = await RoomModel.findOne({number: number});
        if(roomExists){
            return res.status(400).json({error: 1, message: "Room already exists"});
        }
        if(type !== 0 || type !== 1 || type !== 2 || type !== 3) {
            return res.status(400).json({error: 1, message: "Invalid room type"});
        }

        const room = new RoomModel({
                number: number,
                size: size,
                type: type,
                occupied: false
            }
        );

        try {
            await room.save();
            return res.json(room);
        } catch(err) {
            return res.status(500).json({
                message: 'Error when creating room',
                error: err
            });
        }
    },

    /**
     * roomController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        RoomModel.findOne({_id: id}, function (err, room) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting room',
                    error: err
                });
            }

            if (!room) {
                return res.status(404).json({
                    message: 'No such room'
                });
            }

            room.number = req.body.number ? req.body.number : room.number;
			room.size = req.body.size ? req.body.size : room.size;
			room.occupied = req.body.occupied ? req.body.occupied : room.occupied;
			
            room.save(function (err, room) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating room.',
                        error: err
                    });
                }

                return res.json(room);
            });
        });
    },

    /**
     * roomController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        RoomModel.findByIdAndRemove(id, function (err, room) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the room.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    }
};
