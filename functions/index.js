const functions = require("firebase-functions");
const firbaseAuth = require("./util/firebaseAuth");

const { getShouts, makeShout } = require("./helpers/shouts");
const { signup, login, uploadImg } = require("./helpers/users");

// Express
const express = require("express");
const app = express();

// Login//////////////////////////////////////////
app.post("/login", login);
// Post Shout////////////////////////////
app.post("/shout", firbaseAuth, makeShout);
// Get Shouts///////////////////////////////////
app.get("/shouts", getShouts);
// Image upload///////////////////
app.post("/user/image", firbaseAuth, uploadImg);
// Signup///////////////////////////////
app.post("/signup", signup);

exports.api = functions.region("europe-west2").https.onRequest(app);
