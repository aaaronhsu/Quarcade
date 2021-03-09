const express = require("express");
const router = express.Router();
//imports schema from models
const HomeLobby = require("../models/homeLobby");

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

//get all the info just for testing
router.get("/", async (req, res) => {
  try {
    const homeLobby = await HomeLobby.find();
    res.json(homeLobby);
  } catch (error) {
    res.status(500).json({ message: error.message }); //500 error, something with our server is wrong
  }
});

module.exports = router;
