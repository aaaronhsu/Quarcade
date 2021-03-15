const socketio = require('socket.io');

const socketList = {
  unassigned: [],
};

const socketLocation = {

};

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
      
      // adds user to the roomless socket list
      socketList.unassigned.push(client.id);
      // adds an address so we know which room the user is in
      socketLocation[client.id] = "unassigned";

      client.on("printConnectedSockets", () => {
        console.log("List of all connected sockets:", socketList);
      });
    
      // when a user disconnects from the server, this detects the socket disconnection and removes the socket id from the list
      client.on("disconnect", () => {
        console.log(`A user has disconnected with id ${client.id}`);
        // fetches where the user is (which room)
        let socketLoc = socketLocation[client.id];

        // deletes user from the specific room
        socketList[socketLoc].splice(socketList[socketLoc].indexOf(client.id), 1);

        // if there are no more users in the room, delete the room
        if (socketLoc !== "unassigned" && socketList[socketLoc].length == 0) delete socketList[socketLoc];

        // remove the address to the user
        delete socketLocation[client.id];
      })
    });
  },

};