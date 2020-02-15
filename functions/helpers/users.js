const { admin, db } = require("../util/admin");

const firebaseConfig = require("../util/firebaseConfig");

const firebase = require("firebase");
firebase.initializeApp(firebaseConfig);

const { validateSignupData, validateLoginData } = require("../util/validators");

exports.signup = (request, response) => {
  const newUser = {
    email: request.body.email,
    password: request.body.password,
    confirmPassword: request.body.confirmPassword,
    name: request.body.name
  };
  // validation//////////////////////////
  const { valid, errors } = validateSignupData(newUser);

  if (!valid) return response.status(400).json(errors);
  // validation////////////////////////////////////////
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

  // validation//////////////////////////
  const { valid, errors } = validateLoginData(user);

  if (!valid) return response.status(400).json(errors);
  // validation////////////////////////////////////////
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
      //   if (error.code === "auth/wrong-password") {
      //     return response
      response
        .status(403)
        .json({ general: "Credentials didn't match, please try again." });
      //   } else {
      //     return response.status(500).json({ error: error.code });
      //   }
    });
};

exports.uploadImg = (request, response) => {
  const path = require("path");
  const Busboy = require("busboy");
  const os = require("os");
  const fs = requier("fs");

  const busboy = new Busboy({ headers: request.headers });

  let imgFileName;
  let imgToUpload = {};
  busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
    const imgExtension = filename.split(".")[filename.split(".").length - 1];
    imgFileName = `${Math.round(Math.random() * 1000000000)}.${imgExtension}`;
    const filepath = path.join(os.tmpdir(), imgFileName);
    imgToUpload = { filepath: filepath, mimetype };
    file.pipe(fs.createWriteStream(filepath));
  });
  busboy.on("finish", () => {
    admin
      .storage()
      .bucket()
      .upload(imgToUpload.filepath, {
        resumable: false,
        metadata: {
          metadata: {
            contentType: imgToUpload.mimetype
          }
        }
      })
      .then(() => {
        const imgUrl = `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${imgFileName}?alt=media`;
        return db
          .doc(`/users/${request.user.name}`)
          .update({ imageUrl: imgUrl });
      })
      .then(() => {
        return response.json({ message: "Image uploaded! " });
      })
      .catch(error => {
        console.error(error);
        return response.status(500).json({ error: error.code });
      });
  });
};
