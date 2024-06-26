var RoomModel = require('../models/roomModel.js');
const StaffModel = require("../models/staffModel");

/**
 * roomController.js
 *
 * @description :: Server-side logic for managing rooms.
 */
module.exports = {

    /**
     * roomController.list()
     */
    list: async function (req, res) {
        try {
            const clients = await RoomModel.find().sort({created: -1});
            return res.json(clients);
        } catch (err) {
            return res.status(500).json({
                message: 'Error when getting client.',
                error: err
            });
        }
    },

    /**
     * roomController.show()
     */
    show: async function (req, res) {
        var id = req.params.id;

        try {
            const room = await RoomModel.findOne({_id: id});
            if (!room) {
                return res.status(404).json({
                    message: 'No such room'
                });
            }

            return res.json(room);
        } catch (err) {
            return res.status(500).json({
                message: 'Error when getting room.',
                error: err
            });
        }
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
