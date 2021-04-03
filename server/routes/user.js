const express = require("express");
const router = express.Router();
//imports schema from models
const User = require("../models/user");

const socketio = require("../serverSockets.js");

// ------------------------------------ POST Requests ------------------------------------

// Adds a room to the database
router.post("/", function (req, res, next) {
  console.log("user has been created");
  User.create(req.body)
    .then(function (user) {
      res.send(user); // sends the message back to the client with the added data
    })
    .catch(next);
});

// ------------------------------------ GET Requests ------------------------------------

// retrieves all room information
router.get("/", async (req, res) => {
  User.find()
    .then(function(users) {
      res.send(users)
    })
    .catch(next);
});

//find user by socketId
router.get("/:query", function (req, res, next) {
  var query = req.params.query;
  User.find({ socket: query })
    .then(function (user) {
      console.log(user);
      
      res.send(user);
    })
    .catch(next);
});

// ------------------------------------ PUT Requests ------------------------------------

// in progress

// ------------------------------------ DELETE Requests ------------------------------------

//delete requests BY SOCKET
router.delete("/:query", function (req, res, next) {
  var query = req.params.query;
  User.findOneAndDelete({ socket: query })
    .then(function (user) {
      res.send(user);
    })
    .catch(next);
});

router.delete("/", function (req, res, next) {
  User.deleteMany({}).then(function() {
    console.log("All elements in collection deleted");
  })
  .catch(next); // weird here, for some reason it works but it never stops
})

module.exports = router;
