const functions = require("firebase-functions");
const firbaseAuth = require("./util/firebaseAuth");

const {
  getShouts,
  makeShout,
  getSingleShout,
  replyToShout
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
// Delete shout ///////////////////////////////
// Comment on shout ///////////////////////////
app.post("/shout/:shoutId/reply", firbaseAuth, replyToShout);
// Unlike shout ///////////////////////////////
// User details
app.post("/user", firbaseAuth, addUserDetails);
app.get("/user", firbaseAuth, getAuthedUser);
// Image upload///////////////////
app.post("/user/image", firbaseAuth, uploadImg);

exports.api = functions.region("europe-west2").https.onRequest(app);
