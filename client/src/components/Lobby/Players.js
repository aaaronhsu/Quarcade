import React, { Component } from "react";
import NameSwitch from './NameSwitch.js'

import clientSocket from "../../ClientSocket.js";
import './Players.css';

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
      clientSocket.emit("reqUpdateNumPlayers");
    });

    clientSocket.on("recSocketRoom", (room) => {
      this.setState({room: room});
      clientSocket.emit("reqUpdateNumPlayers");
    });
  }

  componentWillUnmount() {
    clientSocket.off("recUsersInRoom");
    clientSocket.off("recSocketRoom");
  }




  // ------------------------------------ Render ------------------------------------
  
  render() {
    return (
      <div class="players">

        <h1 class="players-title">Players</h1>

        {
          this.state.players.map(player => (
            <NameSwitch
              key={player}
              player={player}
              players={this.state.players}

              isSelf={player[1] === clientSocket.id}
            />
          ))
        }

        <p class="players-roomcode">Room Code: <span class="players-code">{this.state.room}</span></p>

      </div>
    );
  }
}

export default Players;
