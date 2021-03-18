const socketio = require('socket.io');

module.exports = {
  init: (http) => {
    io = socketio(http, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      },
    });

    // when a user connects to the server, this detects the socket connection and adds the socket id to a list
    io.on("connection", (client) => {

      // ------------------------------------ Intial Requests ------------------------------------
      // adds user to the "unassigned" room
      client.join("unassigned");

      
      client.on("disconnect", () => {

      });



      // ------------------------------------ Utility Requests ------------------------------------

      // prints the rooms the client is connected to
      client.on("socketInformation", () => {
        console.log(client.rooms);
      });
    
      // removes a user from all rooms, except for personal room & adds socket to newRoom
      client.on("moveRoom", (newRoom) => {
        client.rooms.forEach(room => {
          if (room != client.id) client.leave(room);
        });
    
        client.join(newRoom);
      });

      // emits a message that contains a list of the users currently in the room as the user
      client.on("requestPlayersInRoom", () => {
        let room;

        // retrieves list of rooms the client is connected to
        const roomList = Array.from(client.rooms);
        if (roomList[1] === "unassigned") {
          return;
        }

        // retrieves a list of clients that are connected to the same room
        const clients = Array.from(io.sockets.adapter.rooms.get(roomList[roomList.length - 1]));

        client.emit("receivePlayersInRoom", clients);
      });
    });
  },
};