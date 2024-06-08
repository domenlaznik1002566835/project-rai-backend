var ClienthasroomModel = require('../models/clientHasRoomModel.js');
var RoomModel = require('../models/roomModel.js');

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
    create: async function (req, res) {
        const {clientId, roomNumber, contractCreated, contractEnds} = req.body;

        console.log(clientId, roomNumber, contractCreated, contractEnds)

        let roomExists = await ClienthasroomModel.findOne({number: roomNumber, contractEnds: {$gte: contractCreated}});
        if(!roomExists){
            return res.status(400).json({error: 1, message: "Room already has a contract"});
        }

        let roomHasClientExists = await ClienthasroomModel.findOne({number: roomNumber, contractEnds: {$gte: contractCreated}});
        if(roomHasClientExists){
            return res.status(400).json({error: 1, message: "Room already has a client"});
        }

        let date = new Date();
        let today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        let clientHasRoomExists = await ClienthasroomModel.findOne({clientId: clientId, contractEnds: {$gte: today}});
        if(clientHasRoomExists){
            return res.status(400).json({error: 1, message: "Client already has a room"});
        }

        try{
            const clientHasRoom = new ClienthasroomModel({
                    clientId: clientId,
                    room: roomNumber,
                    contractCreated: contractCreated,
                    contractEnds: contractEnds
                }
            );
            await clientHasRoom.save();
            return res.json(clientHasRoom);
        } catch(err) {
            return res.status(500).json({
                message: 'Error when creating clientHasRoom',
                error: err
            });
        }
    }
    ,

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
