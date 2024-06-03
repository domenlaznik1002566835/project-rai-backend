const admin = require('../firebaseAdmin');

async function sendPushNotification(registrationToken, title, body) {
  const message = {
    notification: {
      title: title,
      body: body
    },
    token: registrationToken
  };

  try {
    const response = await admin.messaging().send(message);
    console.log('Successfully sent message:', response);
  } catch (error) {
    console.error('Error sending message:', error);
  }
}

module.exports = {
  sendPushNotification
};
