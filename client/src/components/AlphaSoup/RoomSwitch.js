import React, { Component } from 'react';
import clientSocket from '../../ClientSocket.js';
import Axios from "axios";

class RoomSwitch extends React.Component {


  // ------------------------------------ Socket.io ------------------------------------

  componentDidMount() {
    // when the component mounts, request an auto switch
    // clientSocket.once("reqSwitchToAlphaSoup");

    


    this.handleSwitchRoom();
    // records the room the socket is in
    clientSocket.on("recSocketRoom", (room) => {
      this.makeSwitch(room);
    });
  }

  componentWillUnmount() {
    clientSocket.off("recSocketRoom");
  }



  // ------------------------------------ Axios ------------------------------------

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

  // adds a clone of the room from homelobbies to alphasoup
  async addRoom(roomInfo) {
    try {
      // posts the data to the alphasoup database
      await Axios.post(`http://localhost:5000/alphaSoup`, { roomCode: roomInfo.roomCode, users: roomInfo.users});
      // by now, all the room info is now transferred to alphaSoup      } catch (error) {
    } catch (error) {
      console.log(error.message);
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
        </button><h1>Removed button, should auto switch</h1>
      </div>
    );
  }
}

export default RoomSwitch;