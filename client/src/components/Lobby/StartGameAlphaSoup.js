import React, { Component } from 'react';
import RoomSwitch from './RoomSwitch.js';

import clientSocket from "../../ClientSocket.js";

import './StartGameAlphaSoup.css';;

class StartGameAlphaSoup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      roomSwitch: false
    }
  }



  // ------------------------------------ Form & Button Handling ------------------------------------
  
  handleStartAlphaSoup = () => {
    console.log("started game");
    // switches the room TODO
    this.setState({
      roomSwitch: true
    })

    // emit message for all to start alphaSoup
    clientSocket.emit("reqStartAlphaSoup");
    
    // generates the start letters for players in a room
    clientSocket.emit("reqStartLetters");
  }

  // ------------------------------------ Render ------------------------------------

  render() {
    return (
      <div>
        <button class="startgame" onClick={this.handleStartAlphaSoup}>Start AlphaSoup</button>

        {this.state.roomSwitch ? (<RoomSwitch />) : null}
      </div>
    );
  }
}

export default StartGameAlphaSoup;
