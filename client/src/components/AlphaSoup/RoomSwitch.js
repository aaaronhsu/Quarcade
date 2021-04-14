import React, { Component } from 'react';
import clientSocket from '../../ClientSocket.js';
import Axios from "axios";

class RoomSwitch extends React.Component {

  componentDidMount() {
    // records the room the socket is in
    clientSocket.on("recSocketRoom", (room) => {
      this.makeSwitch(room);
    });
  }

  componentWillUnmount() {
    clientSocket.off("recSocketRoom");
  }

  // takes the room from socket and requests the data
  async makeSwitch(room) {
    try {
      await Axios.get(`http://localhost:5000/homeLobby/${room}`).then(
        res => {
          const roomInfo = res.data[0];
          // logs the info of the room
          // here we do axios.post roomInfo to the room 
          this.addRoom(roomInfo);
        }
      )
    } catch (error) {
      console.log("Could not get that room");
    }
  }


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