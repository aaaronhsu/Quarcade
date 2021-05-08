const socketio = require("socket.io"); 
const User = require("./models/user");
const HomeLobby = require('./models/homeLobby');
const AlphaSoup = require('./models/alphaSoup');


// io.sockets.sockets.get(client) gets socket from id (client)

module.exports = {
  init: (http) => {
    io = socketio(http, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });

    let myRoom = "";

    // when a user connects to the server, this detects the socket connection and adds the socket id to a list
    io.on("connection", client => {
      // ------------------------------------ Initial Requests ------------------------------------
      // adds user to the "unassigned" room
      client.join("unassigned");
      myRoom = "unassigned";

      // initializes client to have a username field
      client.username = client.id;

      
      client.on("disconnect", () => {
        const rooms = Array.from(client.rooms);
        // console.log(rooms);
        // delete user from the user database
        User.findOneAndDelete({socket: client.id})
          .then(function(user) {
            console.log("deleted user");
            //console.log(user);
          })
        // delete user from homelobby
        HomeLobby.findOneAndUpdate({roomCode: myRoom},
          {$pull: {users: {socket: client.id}}})
          .then(function (homeLobby) {
            console.log("deleted user from homelobby array")
            //console.log(homeLobby.users.length);
            if (homeLobby.users.length <= 1) {
              HomeLobby.findOneAndDelete({roomCode: myRoom})
                .then(function(homeLobby) {
                  // console.log(homeLobby);
                  // console.log("last user gone");
                })
            }
          })

        // delete user from alpha
        AlphaSoup.findOneAndUpdate({roomCode: myRoom},
          {$pull: {users: {socket: client.id}}})
          .then(function (alphaSoup) {
            console.log("deleted user from alphaSoup array")
            //console.log(homeLobby.users.length);
            if (alphaSoup.users.length <= 1) {
              AlphaSoup.findOneAndDelete({roomCode: myRoom})
                .then(function(homeLobby) {
                  // console.log(homeLobby);
                  // console.log("last user gone");
                })
            }
          })

          // emit to all other users in a room
          io.to(myRoom).emit("clientDisconnected");
      });

      // ------------------------------------ Utility Requests ------------------------------------

      // emits the rooms the client is connected to
      client.on("reqSocketRoom", () => {
        // retrieves list of rooms the client is connected to
        const roomList = Array.from(client.rooms);
        // console.log(roomList[1]);
        io.to(roomList[1]).emit("recSocketRoom", roomList[roomList.length - 1]);
      });

      // emits the rooms the client is connected to ONLY FOR DATABASE STUFF
      // should only send to the person emitting the message
      client.on("reqSocketRoomDatabaseSwitch", () => {
        // console.log("made it to backend");
        // retrieves list of rooms the client is connected to
        const roomList = Array.from(client.rooms);
        // console.log("my room", roomList[1]);
        io.to(client.id).emit("recSocketRoomDatabaseSwitch", roomList[1]);
      });
      
      // emits the username associated to a socket
      client.on("reqSocketUsername", () => {
        client.emit("recSocketUsername", client.username);

      });

      // emits a message that contains a list of the users currently in the room as the user
      client.on("reqUsersInRoom", () => {
        let room;

        // retrieves list of rooms the client is connected to
        const roomList = Array.from(client.rooms);
        if (roomList[1] === "unassigned") {
          return;
        }

        // retrieves a list of clients ids that are connected to the same room *IMPORTANT*
        const clients = Array.from(io.sockets.adapter.rooms.get(roomList[roomList.length - 1]));

        const ret = [];

        // converts the client ids to socket objects and retrieves username
        clients.forEach(client => {
          ret.push([io.sockets.sockets.get(client).username, io.sockets.sockets.get(client).id]);
        });

        // updates player list for all players in the room
        clients.forEach(client => {
          io.sockets.sockets.get(client).emit("recUsersInRoom", ret);
        });
      });

      // emits a message that contains a list of the sockets currently in the room as the user
      client.on("reqSocketsInRoom", () => {
        // console.log("made it to backend socket");
        let room;

        // retrieves list of rooms the client is connected to
        const roomList = Array.from(client.rooms);
        if (roomList[1] === "unassigned") {
          return;
        }

        // retrieves a list of clients ids that are connected to the same room *IMPORTANT*
        const clients = Array.from(io.sockets.adapter.rooms.get(roomList[roomList.length - 1]));

        const ret = [];

        // converts the client ids to socket objects
        clients.forEach(client => {
          ret.push(io.sockets.sockets.get(client).id);
        });

        // updates player list for all players in the room
        clients.forEach(client => {
          io.sockets.sockets.get(client).emit("recSocketsInRoom", ret);
        });
      });

      // emits a message to increase everyone's vote state for alphaSoup
      client.on("reqAddVoteAlphaSoup", () => {
        // all the rooms the client is in
        const roomList = Array.from(client.rooms);

        // takes the non-unassigned room and emits
        io.to(roomList[1]).emit("recAddVoteAlphaSoup");
      })

      // emits a message to increase everyone's vote state for codeNames
      client.on("reqAddVoteCodeNames", () => {
        // all the rooms the client is in
        const roomList = Array.from(client.rooms);

        // takes the non-unassigned room and emits
        io.to(roomList[1]).emit("recAddVoteCodeNames");
      })

      // emits a message to decrease everyone's vote state for alphasoup
      client.on("reqRemoveVoteAlphaSoup", () => {
        // all the rooms the client is in
        const roomList = Array.from(client.rooms);

        // takes the non-unassigned room and emits
        io.to(roomList[1]).emit("recRemoveVoteAlphaSoup");
      })

      // emits a message to decrease everyone's vote state for codenames
      client.on("reqRemoveVoteCodeNames", () => {
        // all the rooms the client is in
        const roomList = Array.from(client.rooms);

        // takes the non-unassigned room and emits
        io.to(roomList[1]).emit("recRemoveVoteCodeNames");
      })

      // ask from frontend to see if it's time to start
      client.on("reqStart", (game) => {
        const roomList = Array.from(client.rooms);

        io.to(roomList[1]).emit("recStart", game);
      })

      // frontend message to start alphasoup for all users in a room
      client.on("reqStartAlphaSoup", () => {
        const roomList = Array.from(client.rooms);
        io.to(roomList[1]).emit("recStartAlphaSoup");
      })

      // tells all the people in the room to wipe their words count array bc the game is restarting
      client.on("reqWipeWordsOwned", () => {
        const roomList = Array.from(client.rooms);
        io.to(roomList[1]).emit("recWipeWordsOwned");
      })

      // tells them all to switch back to playing version of alpha
      client.on("reqSwitchBackToAlphaGamePage", () => {
        const roomList = Array.from(client.rooms);
        io.to(roomList[1]).emit("recSwitchBackToAlphaGamePage");
      })
      

      // ------------------------------------ Update Requests ------------------------------------

      // removes a user from all rooms, except for personal room & adds socket to newRoom
      client.on("moveRoom", (newRoom) => {
        client.rooms.forEach(room => {
          if (room != client.id) client.leave(room);
        });
    
        client.join(newRoom);
        myRoom = newRoom;
      });

      // changes a client's username
      client.on("changeUsername", (username) => {
        // console.log("server side change user");
        client.username = username;
      });

      // ------------------------------------ Player Interaction Requests ------------------------------------

      // sends a message to all sockets in a room
      client.on("sendMessage", (data) => {
        const roomList = Array.from(client.rooms);

        let info = {
          message: data,
          user: client.username
        };

        // emits the payload to all sockets with the same room
        io.to(roomList[1]).emit("recMessage", info);
      });













      // ------------------------------------ AlphaSoup ------------------------------------

      // calculates point value of a word
      client.on("reqSubmitWord", (data) => {
        
        const dictionary = require("./dictionary.js");

        let points = 0;
        
        for (var i = 0; i < data.word.length; i++) {
          points += dictionary.pointList[data.word.charAt(i)];
        }

        let payload = {
          word: data.word,
          points: points,
          valid: data.valid
        };


        // requests word to be put to the database
        client.emit("recSubmitWord", payload);
      });

      // tells all users to remove the letters of the given word from the list of letters
      client.on("reqUpdateLetters", (lettersLeft) => {
        const roomList = Array.from(client.rooms);

        // emits the word to all users in the same room
        io.to(roomList[1]).emit("recUpdateLetters", (lettersLeft));
      })

      // returns a random letter to all clients connected
      client.on("reqNewLetter", () => {
        const dictionary = require("./dictionary.js");
        const roomList = Array.from(client.rooms);
        
        let newLetter = dictionary.letterList[Math.floor(Math.random() * dictionary.letterList.length)];

        io.to(roomList[1]).emit("recNewLetter", newLetter);
        // client.emit("recNewLetter", newLetter);
      });

      // tells all users in room to get current words
      client.on("reqUpdateWords", () => {
        const roomList = Array.from(client.rooms);

        // emits the payload to all sockets with the same room
        io.to(roomList[1]).emit("recUpdateWords", (roomList[1]));

      });

      // tells all users in room to get current number of votes for next letter
      client.on("reqUpdateNextLetterVote", () => {
        const roomList = Array.from(client.rooms);

        // emits the payload to all sockets with the same room
        io.to(roomList[1]).emit("recUpdateNextLetterVote", (roomList[1]));
      });

      // tells all users in room to reset the number of votes for the next letter
      client.on("reqResetVotesForNextLetter", () => {
        const roomList = Array.from(client.rooms);

        // emits the payload to all sockets with the same room
        io.to(roomList[1]).emit("recResetVotesForNextLetter", (roomList[1]));
      });

      // requests users to retrieve how many letters are left
      client.on("reqLettersLeft", () => {
        const roomList = Array.from(client.rooms);

        // emits the payload to all sockets with the same room
        io.to(roomList[1]).emit("recLettersLeft", (roomList[1]));
      });

      // requests all users in the room to go to the end screen
      client.on("reqAlphaSoupEnd", () => {
        const roomList = Array.from(client.rooms);

        // emits the payload to all sockets with the same room
        io.to(roomList[1]).emit("recAlphaSoupEnd", (roomList[1]));
      });

      // tells all users that are in the end screen that someone returned to the lobby
      client.on("reqUserLeftEndScreen", () => {
        const roomList = Array.from(client.rooms);

        // emits the payload to all sockets with the same room
        io.to(roomList[1]).emit("recUserLeftEndScreen");
      })

      // handles voting for alphasoup
      client.on("reqReplayAlphaSoup", (vote) => {
        const roomList = Array.from(client.rooms);

        // emits the payload to all sockets with the same room
        io.to(roomList[1]).emit("recReplayAlphaSoup", (vote));
      })

      client.on("reqVoteValidWord", (wordData) => {
        const roomList = Array.from(client.rooms);

        let data = {
          username: wordData.username,
          word: wordData.word
        };

        io.to(roomList[1]).emit("recVoteValidWord", (data));
      });


    });

  }
};
