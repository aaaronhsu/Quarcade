//THIS IS ONLY HERE TEMPORARILY UNTIL WE CAN PUSH NEEDED DATA

const mongoose = require("mongoose");

const roomCodeSchema = new mongoose.Schema({
  roomCode: {
    type: String,
    required: true
  },
  active: {
    type: Boolean,
    required: true,
    default: true
  },
  startedAt: {
    type: Date,
    required: true,
    default: Date.now
  }
});

const RoomCode = mongoose.model("roomcode", roomCodeSchema); //the parentheses name will be pluralized and put in colelction
module.exports = RoomCode;
