// Import the Firebase Admin SDK
const admin = require("firebase-admin");

const serviceAccount = require("./firebase-api-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

module.exports = { db };