const functions = require("firebase-functions");
const firbaseAuth = require("./util/firebaseAuth");

const { getShouts, makeShout } = require("./helpers/shouts");
const { signup, login } = require("./helpers/users");

// Express
const express = require("express");
const app = express();

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Get Shouts///////////////////////////////////
app.get("/shouts", getShouts);

// Post Shout////////////////////////////
app.post("/shout", firbaseAuth, makeShout);

// Signup///////////////////////////////
app.post("/signup", signup);

// Login//////////////////////////////////////////
app.post("/login", login);

exports.api = functions.region("europe-west2").https.onRequest(app);
