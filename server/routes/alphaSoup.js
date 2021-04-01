const express = require("express");
const router = express.Router();
//imports schema from models
const AlphaSoup = require("../models/alphaSoup");

const socketio = require("../serverSockets.js");

// ------------------------------------ POST Requests ------------------------------------

// Adds a room to the database ALPHASOUP
router.post("/", function (req, res, next) {
  console.log("Room", req.body.roomCode, "has been created");

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

// ------------------------------------ PUT Requests ------------------------------------

//STILL EDITING THIS

//put requests, allow you to update desired information on a term

//IMPORTANT: in alphaSoup, no users can be added, only in the lobby

//put requests will be used in alpha soup for the chat

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
