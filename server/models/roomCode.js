const mongoose = require("mongoose");

const roomCodeSchema = new mongoose.Schema({
  RoomCode: {
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

module.exports = mongoose.model("RoomCode", roomCodeSchema);
