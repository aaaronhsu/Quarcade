import React, { Component } from 'react';

import socket from '../../ClientSocket.js';

class Players extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      players: [],
    };
  }

  componentDidMount() {
    socket.on("receivePlayersInRoom", (players) => {
      this.setState({players: players});
    });
  }

  getPlayersInRoom = () => {
    socket.emit("requestPlayersInRoom");
  };

  updatePlayersButton = () => {
    return (
      <div>
        <button onClick={() => this.getPlayersInRoom()}>
          Update Players
        </button>
      </div>
    );
  };

  render() {
    return (
      <div>
        <h1>Hello</h1>

        {
          this.state.players.map(player => (
            <h2 key={player}>{player}</h2>
          ))
        }

        {this.updatePlayersButton()}
      </div>
    )}
}

export default Players;
