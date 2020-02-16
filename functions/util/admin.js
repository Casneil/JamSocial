const admin = require("firebase-admin");
var serviceAccount = require("../../../Keys/Firebase_key/key.json");
require("dotenv").config();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://jamsocial-a2a87.firebaseio.com"
});

const db = admin.firestore();

module.exports = { admin, db };
