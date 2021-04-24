const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//create Home and Lobby Schema and model
const AlphaSoupSchema = new Schema({
  //object names should start lowercase and be camelcase
  roomCode: {
    type: String,
    required: true
  },
  active: {
    type: Boolean,
    required: true,
    default: true
  },
  //don't know if we will use this
  startedAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  users: [
    {
      socket: {
        type: String,
        required: true
      }
    }
  ],
  votes: { // for a new letter
    type: Number,
    required: true, 
    default: 0
  }, 
  startLetters: {
    type: Number, 
    required: true,
    default: 4
  }, 
  lettersLeft: {
    type: Number, 
    required: true
  }
});

//this saves the AlphaSoup model in a alphasoups collection in mongo
const AlphaSoup = mongoose.model("alphasoup", AlphaSoupSchema);
module.exports = AlphaSoup;
