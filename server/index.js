const express = require('express');
const socketio = require('socket.io');
const http = require('http');

const app = express();
const server = http.createServer(app);

var val = 0;

const io = socketio(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  },
});

io.on('connection', (client) => {
  client.on('subscribeToTimer', (interval) => {
    console.log('value is being updated every', interval, 'ms');

    setInterval(() => {
      val++;
      client.emit('timer', val);
    }, interval);
  });
});

const port = 8000;
io.listen(port);
console.log('listening on port', port);