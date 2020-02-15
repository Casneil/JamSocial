const functions = require("firebase-functions");

// Firebase
const firebase = require("firebase");
// const firebaseConfig = {
//   apiKey: "AIzaSyAg6iQzBiMhnRsC-VjpmcjTuBEvU0tHBdc",
//   authDomain: "jamsocial-a2a87.firebaseapp.com",
//   databaseURL: "https://jamsocial-a2a87.firebaseio.com",
//   projectId: "jamsocial-a2a87",
//   storageBucket: "jamsocial-a2a87.appspot.com",
//   messagingSenderId: "1044093059363",
//   appId: "1:1044093059363:web:23c84661c267793a328c96",
//   measurementId: "G-PBQQ7SFTQ7"
// };

firebase.initializeApp(firebaseConfig);

// Express
const express = require("express");
const app = express();

// Other Functions
const { getShouts, makeShout } = require("./helpers/shouts");
const { signup, login } = require("./helpers/users");

const isEmpty = string => {
  if (string.trim() === "") return true;
  else return false;
};

const isEmail = email => {
  const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(regEx)) return true;
  else return false;
};

const firbaseAuth = (request, response, next) => {
  let idToken;
  if (
    request.headers.authorization &&
    request.headers.authorization.startsWith("Bearer ")
  ) {
    idToken = request.headers.authorization.split("Bearer ")[1];
  } else {
    console.error("No token found");
    return response.status(403).json({ error: "Unauthorized" });
  }
  admin
    .auth()
    .verifyIdToken(idToken)
    .then(decodedToken => {
      request.user = decodedToken;
      console.log(decodedToken);
      return db
        .collection("users")
        .where("userId", "==", request.user.uid)
        .limit(1)
        .get();
    })
    .then(data => {
      request.user.name = data.docs[0].data().name;
      return next();
    })
    .catch(error => {
      console.error(`Token verification error ${error}`);
      return response.status(403).json(error);
    });
};

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
