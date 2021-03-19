import React, { Component } from "react";

import socket from "../../ClientSocket.js";

class Players extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      room: "unassigned",
      players: [],
    };
  }

  componentDidMount() {
    socket.on("recUsersInRoom", (players) => {
      this.setState({players: players});

    });

    socket.on("recSocketRoom", (room) => {
      this.setState({room: room});
    });
  }

  render() {
    return (
      <div>
        <h1>List of Players in {this.state.room}:</h1>

        {
          this.state.players.map(player => (
            <h1>{player}</h1>
          ))
        }

      </div>
    );
  }
}

export default Players;
