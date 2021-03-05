import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:8000');

function subscribeToTimer(cb) {
  socket.on('timer', val => cb(null, val));
  console.log("hello");
  socket.emit('subscribeToTimer', 100);
}

function reset(cb) {
  console.log("number has been reset");

  let ret = 0;
  socket.emit('resetVal');
  socket.on('reset', val => {ret = val});

  return ret;
}

export { subscribeToTimer, reset };