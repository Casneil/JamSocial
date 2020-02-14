const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

const express = require("express");
const app = express();

// exports.getShouts = functions.https.onRequest((request, response) => {

// });
app.get("/shouts", (request, response) => {
  admin
    .firestore()
    .collection("shouts")
    .orderBy("shoutedAt", "desc")
    .get()
    .then(data => {
      let shouts = [];
      data.forEach(doc => {
        shouts.push({
          shoutId: doc.id,
          body: doc.data().body,
          userSubmit: doc.data().body.userSubmit,
          shoutedAt: doc.data().shoutedAt
        });
      });
      return response.json(shouts);
    })
    .catch(error => console.log(error));
});

app.post("/shout", (request, response) => {
  const newShout = {
    body: request.body.body,
    userSubmit: request.body.userSubmit,
    shoutedAt: new Date().toISOString()
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

exports.api = functions.https.onRequest(app);
