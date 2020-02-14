const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

// Firebase
const firebase = require("firebase");
const firebaseConfig = {
  apiKey: "AIzaSyAg6iQzBiMhnRsC-VjpmcjTuBEvU0tHBdc",
  authDomain: "jamsocial-a2a87.firebaseapp.com",
  databaseURL: "https://jamsocial-a2a87.firebaseio.com",
  projectId: "jamsocial-a2a87",
  storageBucket: "jamsocial-a2a87.appspot.com",
  messagingSenderId: "1044093059363",
  appId: "1:1044093059363:web:23c84661c267793a328c96",
  measurementId: "G-PBQQ7SFTQ7"
};

const db = admin.firestore();
firebase.initializeApp(firebaseConfig);

// Express
const express = require("express");
const app = express();

// Other Functions
const isEmpty = string => {
  if (string.trim() === "") return true;
  else return false;
};

const isEmail = email => {
  const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(regEx)) return true;
  else return false;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.get("/shouts", (request, response) => {
  db.collection("shouts")
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

  db.collection("shouts")
    .add(newShout)
    .then(doc => {
      response.json({ message: `document ${doc.id} created successfully` });
    })
    .catch(error => {
      response.status(500).json({ error: "something went wrong" });
      console.log(error);
    });
});

// Signup
app.post("/signup", (request, response) => {
  const newUser = {
    email: request.body.email,
    password: request.body.password,
    confirmPassword: request.body.confirmPassword,
    name: request.body.name
  };
  // validation
  let errors = {};
  if (isEmpty(newUser.email)) {
    errors.email = "Can't be empty";
  } else if (!isEmail(newUser.email)) {
    errors.email = "Must be a valid email address";
  }

  if (isEmpty(newUser.password)) {
    errors.password = "Can't not be empty!";
  }
  if (newUser.password !== newUser.confirmPassword) {
    errors.confirmPassword = "Passwords must match";
  }
  if (isEmpty(newUser.name)) {
    errors.name = "can't be empty";
  }
  ////////////////////////

  // befor submission
  if (Object.keys(errors).length > 0) return response.status(400).json(errors);
  // validation
  let token, userID;
  db.doc(`/users/${newUser.name}`)
    .get()
    .then(doc => {
      if (doc.exists) {
        return response
          .status(400)
          .json({ name: "this name is already taken" });
      } else {
        return firebase
          .auth()
          .createUserWithEmailAndPassword(newUser.email, newUser.password);
      }
    })
    .then(data => {
      userID = data.user.uid;
      return data.user.getIdToken();
    })
    .then(IdToken => {
      token = IdToken;
      const userCredentials = {
        name: newUser.name,
        email: newUser.email,
        joinedOn: new Date().toISOString(),
        userId: userID
      };
      return db.doc(`/users/${newUser.name}`).set(userCredentials);
    })
    .then(() => {
      return response.status(201).json({ token: token });
    })
    .catch(error => {
      console.error(error);
      if (error.code === "auth/email-already-in-use") {
        return response.status(400).json({ email: "Email already taken" });
      } else {
        return response.status(500).json({ error: error.code });
      }
    });
});

exports.api = functions.region("europe-west2").https.onRequest(app);
