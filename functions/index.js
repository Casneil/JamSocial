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
  getAuthedUser,
  markRead,
  getUserDetails
} = require("./helpers/users");

// Express
const express = require("express");
const app = express();

// Signup///////////////////////////////
app.post("/signup", signup);
// get user by name //////////////////////
app.get("/user/:name", getUserDetails);
// post at notificatio //////////////////////
app.post("/notifications", firbaseAuth, markRead);
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

exports.NotificationOnLike = functions
  .region("europe-west2")
  .firestore.document("likes/{id}")
  .onCreate(snapshot => {
    return db
      .doc(`/shouts/${snapshot.data().shoutId}`)
      .get()
      .then(doc => {
        if (
          doc.exists &&
          doc.data().userSubmit !== snapshot.data().userSubmit
        ) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            shoutedAt: new Date().toISOString(),
            sender: snapshot.data().userSubmit,
            reciever: doc.data().userSubmit,
            type: "like",
            shoutId: doc.id,
            read: false
          });
        }
      })
      .catch(error => console.error(error));
  });
exports.NotificationOnUnLike = functions
  .region("europe-west2")
  .firestore.document("likes/{id}")
  .onDelete(snapshot => {
    return db
      .doc(`/notifications/${snapshot.id}`)
      .delete()
      .catch(error => {
        console.error(error);
        return;
      });
  });
exports.NotificationOnComment = functions
  .region("europe-west2")
  .firestore.document("comments/{id}")
  .onCreate(snapshot => {
    return db
      .doc(`/shouts/${snapshot.data().shoutId}`)
      .get()
      .then(doc => {
        if (
          doc.exists &&
          doc.data().userSubmit !== snapshot.data().userSubmit
        ) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            shoutedAt: new Date().toISOString(),
            sender: snapshot.data().userSubmit,
            reciever: doc.data().userSubmit,
            type: "comment",
            shoutId: doc.id,
            read: false
          });
        }
      })
      .catch(error => {
        console.error(error);
        return;
      });
  });

exports.onUserImageChange = functions
  .region("europe-west2")
  .firestore.document("/users/{userId}")
  .onUpdate(change => {
    console.log(change.before.data());
    console.log(change.after.data());
    if (change.before.data().imageUrl !== change.after.data().imageUrl) {
      console.log("image has changed");
      const batch = db.batch();
      return db
        .collection("shouts")
        .where("userSubmit", "==", change.before.data().name)
        .get()
        .then(data => {
          data.forEach(doc => {
            const shout = db.doc(`/shouts/${doc.id}`);
            batch.update(shout, { userImage: change.after.data().imageUrl });
          });
          return batch.commit();
        });
    } else return true;
  });

exports.onShoutDelete = functions
  .region("europe-west2")
  .firestore.document("/shouts/{shoutId}")
  .onDelete((snapshot, context) => {
    const shoutId = context.params.shoutId;
    const batch = db.batch();
    return db
      .collection("comments")
      .where("shoutId", "==", shoutId)
      .get()
      .then(data => {
        data.forEach(doc => {
          batch.delete(db.doc(`/comments/${doc.id}`));
        });
        return db
          .collection("likes")
          .where("shoutId", "==", shoutId)
          .get();
      })
      .then(data => {
        data.forEach(doc => {
          batch.delete(db.doc(`/likes/${doc.id}`));
        });
        return db
          .collection("notifications")
          .where("shoutId", "==", shoutId)
          .get();
      })
      .then(data => {
        data.forEach(doc => {
          batch.delete(db.doc(`/notifications/${doc.id}`));
        });
        return batch.commit();
      })
      .catch(error => console.error(error));
  });
