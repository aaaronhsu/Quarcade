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
    //don't know if I have to define that this is an array?
    {
      name: {
        type: String,
        required: true
      },
      socket: {
        type: String,
        required: true
      },
      wordsOwned: [
        {
          word: {
            type: String,
            required: true
          },
          points: {
            type: Number,
            required: true
          }
        }
      ]
    }
  ]
});
