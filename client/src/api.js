import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:8000');

function subscribeToTimer(cb) {
  socket.on('timer', val => cb(null, val));
  console.log("hello");
  socket.emit('subscribeToTimer', 100);
}

export { subscribeToTimer };