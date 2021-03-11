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

socket.init(server);

const port = 8000;
io.listen(port);
console.log('listening on port', port);