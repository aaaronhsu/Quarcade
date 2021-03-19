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
    socket.on("recPlayersInRoom", (players) => {
      this.setState({players: players});
    });

    socket.on("recSocketRoom", (room) => {
      this.setState({room: room});
    })
  }

  render() {
    return (
      <div>
        <h1>List of Players in {this.state.room}:</h1>

        {
          this.state.players.map(player => (
            <h2 key={player}>{player}</h2>
          ))
        }
      </div>
    )}
}

export default Players;
