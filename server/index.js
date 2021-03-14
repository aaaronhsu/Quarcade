const express = require('express');
const socketio = require('socket.io');
const http = require('http');

const app = express();
const server = http.createServer(app);

// connecting sockets
const socket = require("./serverSockets.js");
socket.init(server);



const port = 8000;
io.listen(port);
console.log('listening on port', port);