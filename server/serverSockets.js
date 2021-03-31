const socketio = require("socket.io");

// io.sockets.sockets.get(client) gets socket from id (client)

module.exports = {
  init: (http) => {
    io = socketio(http, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });

    // when a user connects to the server, this detects the socket connection and adds the socket id to a list
    io.on("connection", client => {
      // ------------------------------------ Initial Requests ------------------------------------
      // adds user to the "unassigned" room
      client.join("unassigned");

      // initializes client to have a username field
      client.username = client.id;

      
      client.on("disconnect", () => {

      });

      // ------------------------------------ Utility Requests ------------------------------------

      // emits the rooms the client is connected to
      client.on("reqSocketRoom", () => {
        // retrieves list of rooms the client is connected to
        const roomList = Array.from(client.rooms);

        client.emit("recSocketRoom", roomList[roomList.length - 1]);
      });
      
      // emits the username associated to a client
      client.on("reqSocketUsername", () => {
        let username = client.username;

        client.emit("recSocketUsername", username);

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

        // converts the client ids to socket objects
        clients.forEach(client => {
          ret.push(io.sockets.sockets.get(client).username);
        });

        // updates player list for all players in the room
        clients.forEach(client => {
          io.sockets.sockets.get(client).emit("recUsersInRoom", ret);
        });
      });

      // emits a message that contains a list of the sockets currently in the room as the user
      client.on("reqSocketsInRoom", () => {
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



      // ------------------------------------ Update Requests ------------------------------------

      // removes a user from all rooms, except for personal room & adds socket to newRoom
      client.on("moveRoom", (newRoom) => {
        client.rooms.forEach(room => {
          if (room != client.id) client.leave(room);
        });
    
        client.join(newRoom);
      });

      // changes a client's username
      client.on("changeUsername", (username) => {
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

      // checks if a word is valid and returns point value, returns -1 if the word isn't in the dictionary
      client.on("reqPointValue", (word) => {
        const dictionary = require("./dictionary.js");

        if (word in dictionary.dictionary) {
          client.emit("recPointValue", dictionary.dictionary[word]);
        }
        else {
          client.emit("recPointValue", -1);
        }
      });

      // returns a random letter to all clients connected
      client.on("reqNewLetter", () => {
        const roomList = Array.from(client.rooms);

        const letterList = ["a", "a", "a", "a", "a", "a", "a", "a", "a", 
                            "b", "b", 
                            "c", "c",
                            "d", "d", "d", "d", 
                            "e", "e", "e", "e", "e", "e", "e", "e", "e", "e", "e", "e", 
                            "f", "f",
                            "g", "g", "g",
                            "h", "h",
                            "i", "i", "i", "i", "i", "i", "i", "i", "i", 
                            "j",
                            "k",
                            "l", "l", "l", "l", 
                            "m", "m",
                            "n", "n", "n", "n", "n", "n", 
                            "o", "o", "o", "o", "o", "o", "o", "o", 
                            "p", "p",
                            "q",
                            "r", "r", "r", "r", "r", "r", 
                            "s", "s", "s", "s", 
                            "t", "t", "t", "t", "t", "t", 
                            "u", "u", "u", "u", 
                            "v", "v",
                            "w", "w",
                            "x",
                            "y", "y",
                            "z"];
        
        let newLetter = letterList[Math.floor(Math.random() * letterList.length)];

        io.to(roomList[1]).emit("recMessage", newLetter);
      });

    });

  }
};
