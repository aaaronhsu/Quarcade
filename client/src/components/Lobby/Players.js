import React, { Component } from "react";

import clientSocket from "../../ClientSocket.js";

class Players extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      room: "unassigned",
      players: [],
    };
  }

  componentDidMount() {
    clientSocket.on("recUsersInRoom", (players) => {
      this.setState({players: players});

    });

    clientSocket.on("recSocketRoom", (room) => {
      this.setState({room: room});
    });
  }

  componentWillUnmount() {
    clientSocket.off("recUsersInRoom");
    clientSocket.off("recSocketRoom");
  }
  
  render() {
    return (
      <div>
        <h1>List of Players in {this.state.room}:</h1>

        {
          this.state.players.map(player => (
            <h1 key={player.id}>{player}</h1>
          ))
        }

      </div>
    );
  }
}

export default Players;
