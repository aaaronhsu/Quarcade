const express = require("express");
const router = express.Router();
//imports schema from models
const RoomCode = require("../models/roomCode");

//pushing a room code to mongo
router.post("/", async (req, res) => {
  //create the information
  const roomCode = new RoomCode({
    roomCode: req.body.roomCode
  });
  //add the information
  try {
    const newRoomCode = await roomCode.save();
    res.status(201).json(newRoomCode); //201 is a successfully created code
  } catch (error) {
    res.status(400).json({ message: error }); //400 errors are when user gives bad data
  }
});

//get all the info just for testing
router.get("/", async (req, res) => {
  try {
    const roomCodes = await RoomCode.find();
    res.json(roomCodes);
  } catch (error) {
    res.status(500).json({ message: error.message }); //500 error, something with our server is wrong
  }
});

module.exports = router;
