const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//create users model
const UserSchema = new Schema({
  //object names should start lowercase and be camelcase
  roomCode: {
    type: String, 
    required: true
  },
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
});

//this saves the user model in a users collection in mongo
const User = mongoose.model("user", UserSchema);
module.exports = User;
