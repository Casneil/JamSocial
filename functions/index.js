const functions = require("firebase-functions");
const firbaseAuth = require("./util/firebaseAuth");
const { db } = require("./util/admin");

const {
  getShouts,
  unlikeShout,
  likeShout,
  makeShout,
  getSingleShout,
  replyToShout,
  deleteShout
} = require("./helpers/shouts");
const {
  signup,
  login,
  uploadImg,
  addUserDetails,
  getAuthedUser
} = require("./helpers/users");

// Express
const express = require("express");
const app = express();

// Signup///////////////////////////////
app.post("/signup", signup);
// Login//////////////////////////////////////////
app.post("/login", login);
// Post Shout////////////////////////////
app.post("/shout", firbaseAuth, makeShout);
// Get Shouts///////////////////////////////////
app.get("/shouts", getShouts);
// Single shout ////////////////////////
app.get("/shout/:shoutId", getSingleShout);
// Like shout /////////////////////////////////
app.get("/shout/:shoutId/like", firbaseAuth, likeShout);
// Unlike shout ///////////////////////////////
app.get("/shout/:shoutId/unlike", firbaseAuth, unlikeShout);
// Delete shout ///////////////////////////////
app.delete("/shout/:shoutId", firbaseAuth, deleteShout);
// Comment on shout ///////////////////////////
app.post("/shout/:shoutId/reply", firbaseAuth, replyToShout);
// User details
app.post("/user", firbaseAuth, addUserDetails);
app.get("/user", firbaseAuth, getAuthedUser);
// Image upload///////////////////
app.post("/user/image", firbaseAuth, uploadImg);

exports.api = functions.region("europe-west2").https.onRequest(app);

exports.notificationOnLike = functions
  .region("europe-west1")
  .firestore.document("likes/{id")
  .onCreate(snapshot => {
    db.doc(`/shouts/${snapshot.data().shoutId}`)
      .get()
      .then(doc => {
        if (doc.exists) {
          return db.doc(`/notifications${snapshot.id}`).set({
            shoutedAt: new Date().toISOString(),
            reciever: doc.data().userSubmit,
            sender: snapshot.data().userSubmit,
            type: "like",
            shoutId: doc.id,
            seen: false
          });
        }
      })
      .then(() => {
        return;
      })
      .catch(error => {
        console.error(error);
        return;
      });
  });

exports.notificationOnComment = functions
  .region("europe-west1")
  .firestore.document("comments/{id")
  .onCreate(snapshot => {
    db.doc(`/shouts/${snapshot.data().shoutId}`)
      .get()
      .then(doc => {
        if (doc.exists) {
          return db.doc(`/notifications${snapshot.id}`).set({
            shoutedAt: new Date().toISOString(),
            reciever: doc.data().userSubmit,
            sender: snapshot.data().userSubmit,
            type: "comment",
            shoutId: doc.id,
            seen: false
          });
        }
      })
      .then(() => {
        return;
      })
      .catch(error => {
        console.error(error);
        return;
      });
  });

exports.notificationOnUnlike = functions
  .region("europe-west1")
  .firestore.document("likes/{id")
  .onDelete(snapshot => {
    db.doc(`/notifications/${snapshot.id}`)
      .delete()
      .then(() => {
        return;
      })
      .catch(error => {
        console.error(error);
        return;
      });
  });
