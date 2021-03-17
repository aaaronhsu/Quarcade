import React, { Component } from 'react';
import JoinRoom from './JoinRoom.js';
import CreateRoom from './CreateRoom.js';
import socket from '../../ClientSocket.js';

class Home extends React.Component {

  constructor(props) {
    super(props);
  }

  requestSocketInfo = () => {
    socket.emit("socketInformation");
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
