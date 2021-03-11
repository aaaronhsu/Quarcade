const express = require('express');
const socketio = require('socket.io');
const http = require('http');

const socket = require("./serverSockets.js");

const app = express();
const server = http.createServer(app);


var val = 0;

const io = socketio(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  },
});


const socketList = [];
// for some reason, managing the socket info in a different file isn't working
// socket.init(server);


// temporarily hosting socket connections in the main server js file
// when a user connects to the server, this detects the socket connection and adds the socket id to the list
io.on("connection", (client) => {
  console.log(`A user has connected with id ${client.id}`);

  socketList.concat(client.id);

  // when a user disconnects from the server, this detects the socket disconnection and removes the socket id from the list
  io.on("disconnect", () => {
    delete socketList(client.id);
  })
});



const port = 8000;
io.listen(port);
console.log('listening on port', port);