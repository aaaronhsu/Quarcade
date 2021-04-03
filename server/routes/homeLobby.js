const express = require("express");
const router = express.Router();
//imports schema from models
const HomeLobby = require("../models/homeLobby");

const socketio = require("../serverSockets.js");

// ------------------------------------ POST Requests ------------------------------------

// Adds a room to the database
router.post("/", function (req, res, next) {
  console.log("Room", req.body.roomCode, "has been created in homelobby");
  HomeLobby.create(req.body)
    .then(function (homelobby) {
      res.send(homelobby); // sends the message back to the client with the added data
    })
    .catch(next);
});

// ------------------------------------ GET Requests ------------------------------------

// retrieves all room information
router.get("/", async (req, res) => {
  try {
    const homeLobby = await HomeLobby.find();
    res.json(homeLobby);
  } catch (error) {
    res.status(500).json({ message: error.message }); //500 error, something with our server is wrong
  }
});

//get requests for one thing, if it doesn't get it, returns nothing (empty array)
router.get("/:query", function (req, res, next) {
  var query = req.params.query;
  HomeLobby.find({ roomCode: query })
    .then(function (homelobby) {
      console.log(homelobby);
      
      res.send(homelobby);
    })
    .catch(next);
});

// ------------------------------------ PUT Requests ------------------------------------

//put requests, allow you to update desired information on a term

//you input a user, and it adds it to the right room (homeLobby/<room> for axios)
//returns the updated user
router.put("/:query", function (req, res, next) {
  var query = req.params.query;
  var socket = req.body.users.socket;

  HomeLobby.findOneAndUpdate({ roomCode: query }, { $push: { users: {socket: socket} } })
    .then(function () {
      HomeLobby.find({ roomCode: query }).then(function (homelobby) {
        res.send(homelobby);
      });
    })
    .catch(next);
});

// ------------------------------------ DELETE Requests ------------------------------------

//delete requests BY ROOMCODE- deletes an item and returns this deleted item
router.delete("/:query", function (req, res, next) {
  var query = req.params.query;
  HomeLobby.findOneAndDelete({ roomCode: query })
    .then(function (homelobby) {
      res.send(homelobby);
    })
    .catch(next);
});

router.delete("/", function (req, res, next) {
  HomeLobby.deleteMany({}).then(function() {
    console.log("All elements in collection deleted");
  })
  .catch(next); // weird here, for some reason it works but it never stops
})

module.exports = router;
