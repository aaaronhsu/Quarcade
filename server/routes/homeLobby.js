const express = require("express");
const router = express.Router();
//imports schema from models
const HomeLobby = require("../models/homeLobby");

/*
//pushing a room code to mongo
router.post("/", async (req, res) => {
  //create the information
  const homeLobby = new HomeLobby(req.body); //req.body accesses the json converted information from the request (ALL OF IT)
  //add the information
  try {
    const newHomeLobby = await homeLobby.save();
    res.status(201).json(newHomeLobby); //201 is a successfully created code
  } catch (error) {
    res.status(400).json({ message: error }); //400 errors are when user gives bad data
  }
});
*/

//another method of posting, curious about how it works
router.post("/", function (req, res, next) {
  HomeLobby.create(req.body)
    .then(function (homelobby) {
      res.send(homelobby); //sends the message back to the client with the added data
    })
    .catch(next);
});

//get all the info- this is to loop through to see if a room exists if that's what we do
router.get("/", async (req, res) => {
  try {
    const homeLobby = await HomeLobby.find();
    res.json(homeLobby);
  } catch (error) {
    res.status(500).json({ message: error.message }); //500 error, something with our server is wrong
  }
});

/*
//put requests, allow you to update desired information on a term
router.put('/:id', asyn (req, res, next) => {

})
*/

//delete requests- deletes an item and returns this deleted item
router.delete("/:id", function (req, res, next) {
  HomeLobby.findByIdAndRemove({ _id: req.params.id })
    .then(function (homelobby) {
      res.send(homelobby);
    })
    .catch(next);
});

//get requests for one thing, if it doesn't get it, returns nothing (empty array)
router.get("/:query", function (req, res, next) {
  var query = req.params.query;
  HomeLobby.find({ roomCode: query }, function (err, result) {
    if (err) throw err;
    if (result) {
      res.send(result);
    }
  }).catch(next);
});

module.exports = router;
