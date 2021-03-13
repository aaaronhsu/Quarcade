const express = require("express");
const router = express.Router();
//imports schema from models
const HomeLobby = require("../models/homeLobby");

//POSTS

//another method of posting, curious about how it works
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
//this specifc one allows you to add a user!

//THIS DOES NOT WORK YET=
//this should allow the user to be added
router.put("/:query", function (req, res, next) {
  var query = req.params.query;
  HomeLobby.findOneAndUpdate({ roomCode: query }, { $push: { users: { name: req.body.name } } })
    .then(function () {
      HomeLobby.find({ roomCode: query }).then(function (homelobby) {
        res.send(homelobby);
      });
    })
    .catch(next);
});

//DELETES

/* COMMENTED OUT BECAUSE FOR SOME REASON I CAN'T HAVE MULTIPLY DELETE REQS W same path
//delete requests BY ID- deletes an item and returns this deleted item
router.delete("/:id", function (req, res, next) {
  HomeLobby.findByIdAndRemove({ _id: req.params.id })
    .then(function (homelobby) {
      res.send(homelobby);
    })
    .catch(next);
});
*/

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
