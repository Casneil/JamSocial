const { db } = require("../util/admin");

// Get all shouts ////////////////////////////////////////////////////////////
exports.getShouts = (request, response) => {
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
          shoutedAt: doc.data().shoutedAt,
          commentCount: doc.data().commentCount,
          likeCount: doc.data().likeCount
        });
      });
      return response.json(shouts);
    })
    .catch(error => {
      console.error(error);
      response.status(500).json({ error: error.code });
    });
};
// Get single shout ////////////////////////////////////////////////////////////
exports.getSingleShout = (request, response) => {
  let shoutData = {};
  db.doc(`/shouts/${request.params.shoutId}`)
    .get()
    .then(doc => {
      if (!doc.exists) {
        return response.status(404).json({ error: "Shout not found!" });
      } else {
        shoutData = doc.data();
      }
      shoutData.shoutId = doc.id;
      return db
        .collection("comments")
        .orderBy("shoutedAt", "desc")
        .where("shoutId", "==", request.params.shoutId)
        .get();
    })
    .then(data => {
      shoutData.comments = [];
      data.forEach(doc => {
        shoutData.comments.push(doc.data());
      });
      return response.json(shoutData);
    })
    .catch(error => {
      console.log(error);
      response.status(500).response.json({ error: error.code });
    });
};

// reply to single shout ////////////////////////////////////////////////////////////
exports.replyToShout = (request, response) => {
  if (request.body.body.trim() === "")
    return response.status(400).json({ error: "Can't be empty" });

  const newShout = {
    body: request.body.body,
    shoutedAt: new Date().toISOString(),
    shoutId: request.params.shoutId,
    userSubmit: request.user.name,
    image: request.user.imageUrl
  };
  db.doc(`/shouts/${request.params.shoutId}`)
    .get()
    .then(doc => {
      if (!doc.exists) {
        return response.status(404).json({ error: "shout not found!" });
      }
      return doc.ref.update({ commentCount: doc.data().commentCount + 1 });
    })
    .then(() => {
      return db.collection("comments").add(newShout);
    })
    .then(() => {
      response.json(newShout);
    })
    .catch(error => {
      console.log(error);
      response
        .status(500)
        .json({ error: `Oops something went wrong ${error.code}` });
    });
};

// Make a shout ////////////////////////////////////////////////////////////
exports.makeShout = (request, response) => {
  if (request.body.body.trim() === "") {
    return response.status(400).json({ body: "Can't be empty" });
  }
  const newShout = {
    body: request.body.body,
    userSubmit: request.user.name,
    shoutedAt: new Date().toISOString(),
    image: request.user.imageUrl,
    likeCount: 0,
    commentCount: 0
  };

  db.collection("shouts")
    .add(newShout)
    .then(doc => {
      const responseShout = newShout;
      responseShout.shoutId = doc.id;
      response.json(responseShout);
    })
    .catch(error => {
      console.log(error);
      response.status(500).json({ error: "something went wrong" });
    });
};

// Like shout //////////////////
exports.likeShout = (request, response) => {
  const likingShout = db
    .collection("likes")
    .where("userSubmit", "==", request.user.name)
    .where("shoutId", "==", request.params.shoutId)
    .limit(1);

  const shoutDocument = db.doc(`/shouts/${request.params.shoutId}`);
  let shoutObject;
  shoutDocument
    .get()
    .then(doc => {
      if (doc.exists) {
        shoutObject = doc.data();
        shoutObject.shoutId = doc.id;
        return likingShout.get();
      } else {
        return response.status(404), json({ error: `Shout not found` });
      }
    })
    .then(data => {
      if (data.empty) {
        return db
          .collection("likes")
          .add({
            shoutId: request.params.shoutId,
            userSubmit: request.user.name
          })
          .then(() => {
            shoutObject.likeCount += 1;
            return shoutDocument.update({ likeCount: shoutObject.likeCount });
          })
          .then(() => {
            return response.json(shoutObject);
          });
      } else {
        return response.status(400).json({ error: "Already liked" });
      }
    })
    .catch(error => {
      console.log(error);
      response.status(500).json({ error: error.code });
    });
};
// Unlike shout ////////////////
exports.unlikeShout = (request, response) => {
  const likingShout = db
    .collection("likes")
    .where("userSubmit", "==", request.user.name)
    .where("shoutId", "==", request.params.shoutId)
    .limit(1);

  const shoutDocument = db.doc(`/shouts/${request.params.shoutId}`);
  let shoutObject;
  shoutDocument
    .get()
    .then(doc => {
      if (doc.exists) {
        shoutObject = doc.data();
        shoutObject.shoutId = doc.id;
        return likingShout.get();
      } else {
        return response.status(404), json({ error: `Shout not found` });
      }
    })
    .then(data => {
      if (data.empty) {
        return response.status(400).json({ error: "Not liked" });
      } else {
        return db
          .doc(`/likes/${data.docs[0].id}`)
          .delete()
          .then(() => {
            shoutObject.likeCount -= 1;
            return shoutDocument.update({ likeCount: shoutObject.likeCount });
          })
          .then(() => {
            response.json(shoutObject);
          });
      }
    })
    .catch(error => {
      console.log(error);
      return response.status(500).json({ error: error.code });
    });
};

// delete shout
exports.deleteShout = (request, response) => {
  const shout = db.doc(`/shouts/${request.params.shoutId}`);
  shout
    .get()
    .then(doc => {
      if (!doc.exists) {
        return response.status(404).json({ error: "Shout not found" });
      }
      if (doc.data().userSubmit !== request.user.name) {
        return response.status(403).json({ error: "Not authorized!" });
      } else {
        return shout.delete();
      }
    })
    .then(() => {
      response.json({ message: "Deleted successfully" });
    })
    .catch(error => {
      console.error(error);
      return response.status(500).json({ error: error.code });
    });
};
