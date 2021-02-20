const express = require("express");
const router = express.Router();
//imports schema from models
const RoomCode = require("../models/roomCode");

//pushing a room code to mongo
router.post("/", async (req, res) => {
  //create the information
  const roomCode = new RoomCode({
    RoomCode: req.body.RoomCode
  });
  //add the information
  try {
    const newRoomCode = await roomCode.save();
    res.status(201).json(newRoomCode); //201 is a successfully created code
  } catch (error) {
    res.status(400).json({ message: error }); //400 errors are when user gives bad data
  }
});

module.exports = router;
