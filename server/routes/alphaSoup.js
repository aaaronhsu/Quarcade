const express = require("express");
const router = express.Router();
//imports schema from models
const AlphaSoup = require("../models/alphaSoup");

const socketio = require("../serverSockets.js");

// ------------------------------------ POST Requests ------------------------------------

// Adds a room to the database ALPHASOUP
router.post("/", function (req, res, next) {
  AlphaSoup.create(req.body)
    .then(function (alphaSoup) {
      res.send(alphaSoup); // sends the message back to the client with the added data
    })
    .catch(next);
});

// ------------------------------------ GET Requests ------------------------------------

// retrieves all room information
router.get("/", async (req, res) => {
  AlphaSoup.find()
    .then(function(alphaSoups) {
      res.send(alphaSoups)
    })
    .catch(next);
});

//get requests for one thing, if it doesn't get it, returns nothing (empty array)
router.get("/:query", function (req, res, next) {
  var query = req.params.query;
  AlphaSoup.find({ roomCode: query })
    .then(function (alphaSoup) {
      res.send(alphaSoup);
    })
    .catch(next);
});

// ------------------------------------ PATCH Requests ------------------------------------

// this function allows you to change the new word votes of an alphasoup room
router.patch("/:query", function (req, res, next) {
  // query is the roomCode you want to patch the counter to
  var query = req.params.query;
  AlphaSoup.findOneAndUpdate({roomCode: query}, {votes: req.body.votes})
    .then(function (alphaSoup) {
      res.send(alphaSoup);
    })
    .catch(next);
})

// changes the amount of letters that start on the board
router.patch("/changeStartLetters/:roomCode", function (req, res, next) {
  var roomCode = req.params.roomCode;
  AlphaSoup.findOneAndUpdate({roomCode: roomCode}, {startLetters: req.params.startLetters})
    .then(function (alphaSoup) {
      res.send(alphaSoup);
    })
    .catch(next);
})

// sets the amount of letters left
router.patch("/setLettersLeft/:roomCode", function (req, res, next) {
  var roomCode = req.params.roomCode;
  AlphaSoup.findOneAndUpdate({roomCode: roomCode}, {lettersLeft: req.params.lettersLeft})
    .then(function (alphaSoup) {
      res.send(alphaSoup);
    })
    .catch(next);
})

// ------------------------------------ DELETE Requests ------------------------------------

//delete requests BY ROOMCODE- deletes an item and returns this deleted item
//this removes a room from a specific game
router.delete("/:query", function (req, res, next) {
  var query = req.params.query;
  AlphaSoup.findOneAndDelete({ roomCode: query })
    .then(function (alphaSoup) {
      res.send(alphaSoup);
    })
    .catch(next);
});

router.delete("/", function (req, res, next) {
  AlphaSoup.deleteMany({}).then(function() {
    console.log("All elements in collection deleted");
  })
  .catch(next); // weird here, for some reason it works but it never stops
})

module.exports = router;
