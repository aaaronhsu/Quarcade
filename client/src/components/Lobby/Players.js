import React, { Component } from 'react';

import socket from '../../ClientSocket.js';

class Players extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      room: "unassigned",
      players: [],
    };
  }

  componentDidMount() {
    socket.on("receivePlayersInRoom", (players) => {
      this.setState({players: players});
    });

    socket.on("getSocketRoom", (room) => {
      this.setState({room: room});
    })
  }

  getPlayersInRoom = () => {
    socket.emit("requestPlayersInRoom");
    socket.emit("requestSocketRoom");
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
        <h1>List of Players in {this.state.room}:</h1>

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
