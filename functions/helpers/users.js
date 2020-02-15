const db = require("../util/admin");

const firebaseConfig = require("../util/firebaseConfig");

const firebase = require("firebase");
firebase.initializeApp(firebaseConfig);

exports.signup = (request, response) => {
  const newUser = {
    email: request.body.email,
    password: request.body.password,
    confirmPassword: request.body.confirmPassword,
    name: request.body.name
  };
  // validation//////////////////////////
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
};

// Login//////////////////////////////////////////
exports.login = (request, response) => {
  const user = {
    email: request.body.email,
    password: request.body.password
  };
  let errors = {};
  if (isEmpty(user.email)) errors.email = "can't be empty!";
  if (isEmpty(user.password)) errors.password = "can't be empty!";
  if (Object.keys(errors).length > 0) return response.status(400).json(errors);

  firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then(data => {
      return data.user.getIdToken();
    })
    .then(token => {
      return response.json({ token });
    })
    .catch(error => {
      console.error(error);
      if (error.code === "auth/wrong-password") {
        return response
          .status(403)
          .json({ general: "Credentials should match, please try again." });
      } else {
        return response.status(500).json({ error: error.code });
      }
    });
};
