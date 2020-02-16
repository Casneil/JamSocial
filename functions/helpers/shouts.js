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
    userImage: request.user.imageUrl
  };
  db.doc(`/shouts/${request.params.shoutId}`)
    .get()
    .then(doc => {
      if (!doc.exists) {
        return response.status(404).json({ error: "shout not found!" });
      }
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
    return response.status(400).json({ body: "Body can't be empty" });
  }
  const newShout = {
    body: request.body.body,
    userSubmit: request.user.name,
    shoutedAt: new Date().toISOString(),
    likeCount: 0,
    commentCount: 0
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
};
