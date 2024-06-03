var ClientModel = require('../models/clientModel.js');
const { sendPushNotification } = require('../middleware/sendPushNotifications.js');
var FCMTokenModel = require('../models/FCMtokenModel.js'); 

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
    create: async function (req, res) {
        try {
            const client = new ClientModel({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: req.body.password
            });

            await client.save();

            // Create session after client is created
            req.session.userId = client._id;

            return res.status(201).json(client);
        } catch (err) {
            return res.status(500).json({
                message: 'Error when creating client',
                error: err
            });
        }
    },

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

    logout: async function (req, res) {
        try {
            if (req.session.userId) {
                req.session.destroy(function (err) {
                    if (err) {
                        console.error('Error destroying session:', err);
                        return res.status(500).json({ message: 'Error logging out' });
                    }

                    console.log('User logged out successfully');
                    return res.status(200).json({ message: 'Logged out successfully' });
                });
            } else {
                return res.status(400).json({ message: 'No user session found' });
            }
        } catch (err) {
            console.error('Logout error:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
    },

    login: async function (req, res, next) {
        try {
            console.log('Login request:', req.body);

            const user = await ClientModel.authenticate(req.body.email, req.body.password);
            if (!user) {
                console.error('Authentication failed: User not found');
                throw new Error('User not found.');
            }

            req.session.userId = user._id;

            const tokenRecord = await FCMTokenModel.findOne({ userId: user._id });
            if (tokenRecord) {
                console.log('Token record found:', tokenRecord);
                if (tokenRecord.fcmToken) {
                    console.log('FCM token:', tokenRecord.fcmToken);
                    console.log('Attempting to send push notification');
                    await sendPushNotification(tokenRecord.fcmToken, "2FA Verification", "Please verify your login attempt.");
                    console.log('Push notification sent successfully');
                }
            } else {
                console.log('No token record found for user:', user._id);
            }

            return res.json({ success: true, message: "Login successful", userId: user._id });
        } catch (err) {
            console.error('Login error:', err);
            var error = new Error('Wrong email or password');
            error.status = 401;
            return next(error);
        }
    },

    registerFCMToken: async function (req, res) {
        const { userId, fcmToken } = req.body;
        console.log('Register FCM token request received:', req.body);

        if (!userId || !fcmToken) {
            console.log('Missing userId or fcmToken');
            return res.status(400).json({ message: 'Missing userId or fcmToken' });
        }

        try {
            const client = await ClientModel.findById(userId);
            if (!client) {
                console.log('User not found:', userId);
                return res.status(404).json({ message: 'User not found' });
            }

            let tokenRecord = await FCMTokenModel.findOne({ userId });
            if (tokenRecord) {
                tokenRecord.fcmToken = fcmToken;
                console.log('Token record updated:', tokenRecord);
            } else {
                tokenRecord = new FCMTokenModel({ userId, fcmToken });
                console.log('New token record created:', tokenRecord);
            }

            await tokenRecord.save();
            console.log('FCM token registered successfully:', tokenRecord);

            return res.status(200).json({ message: 'FCM token registered successfully' });
        } catch (err) {
            console.error('Error registering FCM token:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
    },

    sendNotification: async function (req, res) {
        const { userId, title, message } = req.body;
        console.log('Send notification request received:', req.body);

        try {
            const tokenRecord = await FCMTokenModel.findOne({ userId });
            if (!tokenRecord || !tokenRecord.fcmToken) {
                console.log('No FCM token found for user:', userId);
                return res.status(404).json({ message: 'No FCM token found' });
            }

            await sendPushNotification(tokenRecord.fcmToken, title, message);
            console.log('Notification sent successfully');
            return res.status(200).json({ message: 'Notification sent successfully' });
        } catch (err) {
            console.error('Error sending notification:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
};
