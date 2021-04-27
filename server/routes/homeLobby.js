const express = require("express");
const router = express.Router();
//imports schema from models
const HomeLobby = require("../models/homeLobby");

const socketio = require("../serverSockets.js");

// ------------------------------------ POST Requests ------------------------------------

// Adds a room to the database
router.post("/", function (req, res, next) {
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
  var name = req.body.users.name;

  HomeLobby.findOneAndUpdate({ roomCode: query }, { $push: { users: {socket: socket, name: name } } })
    .then(function () {
      HomeLobby.find({ roomCode: query }).then(function (homelobby) {
        res.send(homelobby);
      });
    })
    .catch(next);
});

// ------------------------------------ PATCH Requests ------------------------------------

// ------------- ALPHASOUP VOTE CHANGING -------------

// changes the vote count for the number of votes in ALPHASOUP
router.patch("/changeVotesAlphaSoup/:roomCode", function (req, res, next) {
  // roomCode is the roomCode you want to patch the counter to
  var roomCode = req.params.roomCode;
  HomeLobby.findOneAndUpdate({roomCode: roomCode}, {votesAlphaSoup: req.body.votesAlphaSoup})
    .then(function (alphaSoup) {
      res.send(alphaSoup);
    })
    .catch(next);
})

// ------------- CODENAMES VOTE CHANGING -------------

// changes the vote count for the number of votes in CODENAMES
router.patch("/changeVotesCodeNames/:roomCode", function (req, res, next) {
  // roomCode is the roomCode you want to patch the counter to
  var roomCode = req.params.roomCode;
  HomeLobby.findOneAndUpdate({roomCode: roomCode}, {votesCodeNames: req.body.votesCodeNames})
    .then(function (alphaSoup) {
      res.send(alphaSoup);
    })
    .catch(next);
})

// ------------- WIPE VOTE COUNTS SET TO 0 -------------

// sets all the votes to 0 so when u come back to lobby no bugs
router.patch("/wipeVotes/:roomCode", function(req, res, next) {
  var roomCode = req.params.roomCode;
  HomeLobby.findOneAndUpdate({roomCode: roomCode}, {votesAlphaSoup: req.body.votesAlphaSoup, votesCodeNames: req.body.votesCodeNames})
    .then(function (alphaSoup) {
      res.sent(alphaSoup);
    })
    .catch(next);
})

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
