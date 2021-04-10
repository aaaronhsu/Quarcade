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

  handleSwitchName = () => {
    alert("clicked name");
    //make it so a form appears in place
  }

  //for each player, 
  
  render() {
    return (
      <div>
        <h1>List of Players in {this.state.room}:</h1>

        {
          this.state.players.map(player => (
            <div>
            <NameSwitch
              key={player.username}
              player={player}
            />
            </div>
          ))
        }

      </div>
    );
  }
}

export default Players;
