// Import the Firebase Admin SDK
const admin = require("firebase-admin");

// Import your service account key
const serviceAccount = require("./firebase-api-key.json");

// Initialize the app
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Get a reference to the Firestore database
const db = admin.firestore();

// Export the database reference to use in other files
module.exports = { db };