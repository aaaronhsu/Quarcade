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

      // adds user to the "unassigned" room
      client.join("unassigned");

      client.on("socketInformation", () => {
        console.log(client.rooms);
      });

      // removes a user from all rooms, except for personal room & adds socket to newRoom
      client.on("moveRoom", (newRoom) => {
        client.rooms.forEach(room => {
          if (room != client.id) client.leave(room);
        });

        client.join(newRoom);
      })
    
      client.on("disconnect", () => {

      })
    });
  },
};