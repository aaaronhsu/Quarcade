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

    console.log("called serverSockets.js");

    // when a user connects to the server, this detects the socket connection and adds the socket id to a list
    io.on("connection", (client) => {
      console.log(`A user has connected with id ${client.id}`);

      socketList.unassigned.push(client.id);
      socketLocation[client.id] = "unassigned";

      client.on("printConnectedSockets", () => {
        console.log("List of all connected sockets:", socketList);
      });
    
      // when a user disconnects from the server, this detects the socket disconnection and removes the socket id from the list
      client.on("disconnect", () => {
        console.log(`A user has disconnected with id ${client.id}`);
        let socketLoc = socketLocation[client.id];

        console.log(socketLoc);
        socketList[socketLoc].splice(socketList[socketLoc].indexOf(client.id), 1);
        delete socketLocation[client.id];
      })
    });
  }
};