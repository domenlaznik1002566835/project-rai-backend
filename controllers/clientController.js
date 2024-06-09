const axios = require('axios');
const Video2FAModel = require('../models/video2FA');
const ClientModel = require('../models/clientModel');
const WebPushSubscriptionModel = require('../models/WebPushSubscriptionModel');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { sendPushNotification } = require('../middleware/sendPushNotifications');
const FCMTokenModel = require('../models/FCMtokenModel');
var StaffModel = require('../models/staffModel.js');
const webPush = require('web-push');

// Nastavitve Web Push
webPush.setVapidDetails(
  'mailto:nejc.petkoski@student.um.si',  
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

module.exports = {

    sendTestNotification: async function (req, res) {
        const { userId, title, message } = req.body;
        console.log('Send test notification request received:', req.body);
    
        try {
          const tokenRecord = await WebPushSubscriptionModel.findOne({ userId });
          if (!tokenRecord || !tokenRecord.webPushSubscription) {
            console.log('No Web Push subscription found for user:', userId);
            return res.status(404).json({ message: 'No Web Push subscription found' });
          }
    
          const payload = JSON.stringify({ title, message });
          webPush.sendNotification(tokenRecord.webPushSubscription, payload)
            .then(response => {
              console.log('Test notification sent successfully:', response);
              return res.status(200).json({ message: 'Test notification sent successfully' });
            })
            .catch(err => {
              console.error('Error sending test notification:', err);
              return res.status(500).json({ message: 'Internal server error' });
            });
        } catch (err) {
          console.error('Error sending test notification:', err);
          return res.status(500).json({ message: 'Internal server error' });
        }
      },

    list: async function (req, res) {
        try {
            const clients = await ClientModel.find().sort({ created: -1 });
            return res.json(clients);
        } catch (err) {
            return res.status(500).json({
                message: 'Error when getting client.',
                error: err
            });
        }
    },

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

    getByEmail: async function (req, res) {
        var email = req.params.email;

        try {
            const client = await ClientModel.findOne({ email: email});
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
    }
    ,

    create: async function (req, res) {
        const { firstName, lastName, email, password } = req.body;

        let emailExists = await ClientModel.findOne({ email: email });
        if (emailExists) {
            return res.status(400).json({ error: 1, message: "A client with this email already exists" });
        }
        let emailStaffExists = await StaffModel.findOne({ email: email });
        if (emailStaffExists) {
            return res.status(400).json({ error: 1, message: "A staff member with this email already exists" });
        }
        const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 1, message: "Invalid email format" });
        }

        const client = new ClientModel({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password
        });

        try {
            await client.save();
            req.session.userId = client._id;
            return res.json(client);
        } catch (err) {
            return res.status(500).json({
                message: 'Error when creating client',
                error: err
            });
        }
    },

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
            var webiste = req.body.website;
            console.log('Website:', webiste);

            // Authenticate user (client)
            const user = await ClientModel.authenticate(req.body.email, req.body.password);
            if (!user) {
                console.error('Authentication failed: User not found');
                throw new Error('User not found.');
            }

            req.session.userId = user._id;

            const { subscription } = req.body;

            // Save Web Push Subscription if it exists
            if (subscription) {
                console.log('Web Push subscription received:', subscription);

                let tokenRecord = await WebPushSubscriptionModel.findOne({ userId: user._id });
                if (tokenRecord) {
                    tokenRecord.webPushSubscription = subscription;
                    tokenRecord.userModel = 'Client';
                    console.log('Web Push subscription updated:', tokenRecord);
                } else {
                    tokenRecord = new WebPushSubscriptionModel({ userId: user._id, webPushSubscription: subscription, userModel: 'Client' });
                    console.log('New Web Push subscription created:', tokenRecord);
                }
                await tokenRecord.save();
                console.log('Web Push subscription registered successfully:', tokenRecord);
            }

            // Notify administrators only
            const admins = await StaffModel.find({ level: { $gt: 0 } });
            for (const admin of admins) {
                const adminTokenRecord = await WebPushSubscriptionModel.findOne({ userId: admin._id, userModel: 'Staff' });
                if (adminTokenRecord && adminTokenRecord.webPushSubscription) {
                    const payload = JSON.stringify({ title: "2FA Verification", message: "Please verify your login attempt." });
                    webPush.sendNotification(adminTokenRecord.webPushSubscription, payload)
                        .then(response => console.log(`Web Push Notification sent to admin: ${admin.email}`))
                        .catch(err => console.error('Error sending Web Push Notification:', err));
                }
            }

            console.log('Notifications sent successfully');

            // If user has `level`, return it along with the user ID
            if (user.level) {
                return res.json({ success: true, message: "Login successful", userId: user._id, level: user.level });
            }

            // If user does not have `level`, return `level: -1` for regular users (clients)
            return res.json({ success: true, message: "Login successful", userId: user._id, level: -1 });
        } catch (err) {
            console.error('Login error:', err);
            var error = new Error('Wrong email or password');
            error.status = 401;
            return next(error);
        }
    },

    login_web: async function (req, res, next) {
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
    },

    uploadVideo: async function (req, res) {
        upload.single('video')(req, res, async function (err) {
            if (err) {
                return res.status(500).json({ message: 'Error uploading video', error: err });
            }

            const userId = req.session.userId;
            if (!userId) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            const filePath = req.file.path;
            try {
                const video2FA = new Video2FAModel({
                    client: userId,
                    videoPath: filePath
                });
                await video2FA.save();
                return res.status(200).json({ message: 'Video uploaded successfully' });
            } catch (err) {
                return res.status(500).json({ message: 'Error saving video', error: err });
            }
        });
    },

    start2FA: async function (req, res) {
        const userId = req.session.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const tokenRecord = await FCMTokenModel.findOne({ userId });
        if (tokenRecord && tokenRecord.fcmToken) {
            await sendPushNotification(tokenRecord.fcmToken, "2FA Verification", "Please verify your login attempt.");
            return res.status(200).json({ message: '2FA process started' });
        } else {
            return res.status(404).json({ message: 'FCM token not found' });
        }
    },

    verify2FA: async function (req, res) {
        const userId = req.session.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const { videoPath } = req.body;
        if (!videoPath || !fs.existsSync(videoPath)) {
            return res.status(400).json({ message: 'Invalid video path' });
        }

        try {
            const response = await axios.post('http://localhost:5000/process_video', { file_path: videoPath });
            if (response.data.success) {
                return res.status(200).json({ message: '2FA verified successfully' });
            } else {
                return res.status(400).json({ message: '2FA verification failed' });
            }
        } catch (err) {
            return res.status(500).json({ message: 'Error processing video', error: err });
        }
    }
};
