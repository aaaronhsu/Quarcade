import React, { Component } from 'react';
import JoinRoom from './JoinRoom.js';
import CreateRoom from './CreateRoom.js';
import socketio from 'socket.io-client';

class Home extends React.Component {

  constructor(props) {
    super(props);

    let io = socketio('http://localhost:8000');
  }
  render() {
    return (
      <div>
        <JoinRoom />
        <CreateRoom />
      </div>
    )}
}

export default Home;
