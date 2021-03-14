import React, { Component } from 'react';
import JoinRoom from './JoinRoom.js';
import CreateRoom from './CreateRoom.js';
import socketio from 'socket.io-client';

class Home extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      io: socketio('http://localhost:8000'),
    }
  }

  requestSocketInfo = () => {
    this.state.io.emit("printConnectedSockets");
  }

  renderConnectedSocketsButton = () => {
    return (
      <div>
        <button onClick = {() => this.requestSocketInfo()}>
          Print Sockets! (to server terminal)
        </button>
      </div>
    );
  };

  render() {
    return (
      <div>
        <JoinRoom />
        <CreateRoom />

        {this.renderConnectedSocketsButton()}
      </div>
    )}
}

export default Home;
