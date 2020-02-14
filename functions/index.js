const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});

exports.getShouts = functions.https.onRequest((request, response) => {
  // Function URL (getShouts): https://us-central1-jamsocial-a2a87.cloudfunctions.net/getShouts
  admin
    .firestore()
    .collection("shouts")
    .get()
    .then(data => {
      let shouts = [];
      data.forEach(doc => {
        shouts.push(doc.data());
      });
      return response.json(shouts);
    })
    .catch(error => console.log(error));
});

exports.createShout = functions.https.onRequest((request, response) => {
  // Function URL (getShouts): https://us-central1-jamsocial-a2a87.cloudfunctions.net/createShout
  if (request.method !== "Post") {
    return response
      .status(400)
      .json({ message: "Method not allowed for this route" });
  }
  const newShout = {
    body: request.body.body,
    userSubmit: request.body.userSubmit,
    shoutedAt: admin.firestore.Timestamp.fromDate(new Date())
  };

  admin
    .firestore()
    .collection("shouts")
    .add(newShout)
    .then(doc => {
      response.json({ message: `document ${doc.id} created successfully` });
    })
    .catch(error => {
      response.status(500).json({ error: "something went wrong" });
      console.log(error);
    });
});
