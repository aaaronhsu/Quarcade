import React, { Component } from 'react';
import socket from '../../ClientSocket.js';

class AlphaSoup extends React.Component {

  constructor(props) {
    super(props);
  }

  requestSocketInfo = () => {
    socket.emit("requestPlayersInRoom");
  }

  renderConnectedSocketsButton = () => {
    return (
      <div>
        <button onClick = {() => this.requestSocketInfo()}>
          Print rooms this socket is in (to server terminal)
        </button>
      </div>
    );
  };

  render() {
    return (
      <div>

        {this.renderConnectedSocketsButton()}
      </div>
    )}
}

export default AlphaSoup;
