const express = require("express");
const router = express.Router();
//imports schema from models
const HomeLobby = require("../models/homeLobby");

//POSTS

//post to the database (like add a room)
router.post("/", function (req, res, next) {
  HomeLobby.create(req.body)
    .then(function (homelobby) {
      res.send(homelobby); //sends the message back to the client with the added data
    })
    .catch(next);
});

//GETS

//get all the info- this is to loop through to see if a room exists if that's what we do
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

//PUTS

//put requests, allow you to update desired information on a term

//you input a user, and it adds it to the right room (homeLobby/<room> for axios)
//returns the updated user
router.put("/:query", function (req, res, next) {
  var query = req.params.query;
  var name = req.body.users.name;
  var socket = req.body.users.socket;
  console.log("User with socket", socket, "has been added to room", query);

  HomeLobby.findOneAndUpdate({ roomCode: query }, { $push: { users: { name: name, socket: socket } } })
    .then(function () {
      HomeLobby.find({ roomCode: query }).then(function (homelobby) {
        res.send(homelobby);
      });
    })
    .catch(next);
});

//DELETES

//delete requests BY ROOMCODE- deletes an item and returns this deleted item
router.delete("/:query", function (req, res, next) {
  var query = req.params.query;
  HomeLobby.findOneAndDelete({ roomCode: query })
    .then(function (homelobby) {
      res.send(homelobby);
    })
    .catch(next);
});

module.exports = router;
