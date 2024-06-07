const admin = require('firebase-admin');
const serviceAccount = require('./paketnikapp-firebase-adminsdk-eei26-78844499c4.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;
