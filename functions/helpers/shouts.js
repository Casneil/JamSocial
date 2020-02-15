const db = require("../util/admin");

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

exports.makeShout = (request, response) => {
  if (request.body.body.trim() === "") {
    return response.status(400).json({ body: "Body can't be empty" });
  }
  const newShout = {
    body: request.body.body,
    userSubmit: request.user.name,
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
};
