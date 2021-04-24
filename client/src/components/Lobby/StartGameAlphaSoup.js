import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";
import RoomSwitch from './RoomSwitch.js';

import clientSocket from "../../ClientSocket.js"; 

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
  }

  // ------------------------------------ Render ------------------------------------

  render() {
    return (
      <div>
        <button onClick={this.handleStartAlphaSoup}>Start Game</button>
        {this.state.roomSwitch ? (<RoomSwitch />) : null}
      </div>
    );
  }
}

export default StartGameAlphaSoup;
