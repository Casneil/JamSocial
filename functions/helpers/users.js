const { admin, db } = require("../util/admin");

const firebaseConfig = require("../util/firebaseConfig");

const firebase = require("firebase");
firebase.initializeApp(firebaseConfig);

const {
  validateSignupData,
  validateLoginData,
  formatUserDetails
} = require("../util/validators");

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

  const userPic = "user-pic.png";
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
        imageUrl: `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${userPic}?alt=media`,
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
        return response
          .status(500)
          .json({ general: "Something went wrong. Please start over" });
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
      return response
        .status(403)
        .json({ general: "Credentials didn't match, please try again." });
    });
};

exports.uploadImg = (request, response) => {
  const BusBoy = require("busboy");
  const path = require("path");
  const os = require("os");
  const fs = require("fs");

  const busboy = new BusBoy({ headers: request.headers });

  let imageToUpload = {};
  let imageName;

  busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
    console.log(fieldname, file, filename, encoding, mimetype);
    if (mimetype !== "image/jpeg" && mimetype !== "image/png") {
      return response.status(400).json({ error: "Wrong file type submitted" });
    }
    const imageExtension = filename.split(".")[filename.split(".").length - 1];
    imageName = `${Math.round(
      Math.random() * 1000000000000
    ).toString()}.${imageExtension}`;
    const filepath = path.join(os.tmpdir(), imageName);
    imageToUpload = { filepath, mimetype };
    file.pipe(fs.createWriteStream(filepath));
  });
  busboy.on("finish", () => {
    admin
      .storage()
      .bucket()
      .upload(imageToUpload.filepath, {
        resumable: false,
        metadata: {
          metadata: {
            contentType: imageToUpload.mimetype
          }
        }
      })
      .then(() => {
        const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${imageName}?alt=media`;
        return db.doc(`/users/${request.user.name}`).update({ imageUrl });
      })
      .then(() => {
        return response.json({ message: "image uploaded!" });
      })
      .catch(err => {
        console.error(err);
        return response.status(500).json({ error: "something went wrong" });
      });
  });
  busboy.end(request.rawBody);
};

// Add user Details
exports.addUserDetails = (request, response) => {
  let userDetails = formatUserDetails(request.body);

  db.doc(`/users/${request.user.name}`)
    .update(userDetails)
    .then(() => {
      return response.json({ message: "Details added!" });
    })
    .catch(error => {
      console.error(error);
      return response.status(500).json({ error: error.code });
    });
};

// get user details
exports.getUserDetails = (request, response) => {
  let userData = {};
  db.doc(`/users/${request.params.name}`)
    .get()
    .then(doc => {
      if (doc.exists) {
        userData.user = doc.data();
        return db
          .collection("shouts")
          .where("userSubmit", "==", request.params.name)
          .orderBy("shoutedAt", "desc")
          .get();
      } else {
        return response.status(404).json({ error: "User not found!" });
      }
    })
    .then(data => {
      userData.shouts = [];
      data.forEach(doc => {
        userData.shouts.push({
          body: doc.data().body,
          shoutedAt: doc.data().shoutedAt,
          userSubmit: doc.data().userSubmit,
          userImage: doc.data().imageUrl,
          commentCount: doc.data().commentCount,
          likeCount: doc.data().likeCount,
          shoutId: doc.id
        });
      });
      return response.json(userData);
    })
    .catch(error => {
      console.error(error);
      return response.status(500).json({ error: error.code });
    });
};

// Mark notifications read ///////////////////
exports.markRead = (request, response) => {
  let batch = db.batch();
  request.body.forEach(notificationId => {
    const notification = db.doc(`/notifications/${notificationId}`);
    batch.update(notification, { read: true });
  });
  batch
    .commit()
    .then(() => {
      return response.json({ message: "Marked read" });
    })
    .catch(error => {
      console.error(error);
      return response.status(500).json({ error: error.code });
    });
};

// get authed user details
exports.getAuthedUser = (request, response) => {
  let userData = {};
  db.doc(`/users/${request.user.name}`)
    .get()
    .then(doc => {
      if (doc.exists) {
        userData.credentials = doc.data();
        return db
          .collection("likes")
          .where("userSubmit", "==", request.user.name)
          .get();
      }
    })
    .then(data => {
      userData.likes = [];
      data.forEach(doc => {
        userData.likes.push(doc.data());
      });
      return db
        .collection("notifications")
        .where("reciever", "==", request.user.name)
        .orderBy("shoutedAt", "desc")
        .limit(12)
        .get();
    })
    .then(data => {
      userData.notifications = [];
      data.forEach(doc => {
        userData.notifications.push({
          reciever: doc.data().reciever,
          sender: doc.data().sender,
          shoutedAt: doc.data().shoutedAt,
          type: doc.data().type,
          read: doc.data().read,
          shoutId: doc.data().shoutId,
          notificationId: doc.id
        });
      });
      return response.json(userData);
    })
    .catch(error => {
      console.error(error);
      return response.status(500).json({ error: error.code });
    });
};
