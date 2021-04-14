import React, { Component } from 'react';
import clientSocket from '../../ClientSocket.js';
import Axios from "axios";

class RoomSwitch extends React.Component {


  // ------------------------------------ Form & Button Handling ------------------------------------

  // this is a testing function, will convert the homelobby data into alphasoup data
  handleSwitchRoom = () => {

    // request the socket's room
    clientSocket.emit("reqSocketRoom");

    // requests player information to be retrieved
    clientSocket.emit("reqUpdateWords");
    
  }



  // ------------------------------------ Render ------------------------------------
  
  render() {
    return (
      <div>
        <h3>For testing- this button switches room from homelobby to alphasoup</h3>
        <button onClick={this.handleSwitchRoom}>
          Switch to alphasoup room
        </button>
      </div>
    );
  }
}

export default RoomSwitch;