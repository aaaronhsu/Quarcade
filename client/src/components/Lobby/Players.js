import React, { Component } from "react";
import NameSwitch from './NameSwitch.js'

import clientSocket from "../../ClientSocket.js";

class Players extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      room: "unassigned",
      players: [],
    };
  }



  // ------------------------------------ Socket.io ------------------------------------
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




  // ------------------------------------ Render ------------------------------------
  
  render() {
    return (
      <div>
        <h1>List of Players in {this.state.room}:</h1>

        {
          this.state.players.map(player => (
            <NameSwitch
              key={player}
              player={player}
            />
          ))
        }

      </div>
    );
  }
}

export default Players;
