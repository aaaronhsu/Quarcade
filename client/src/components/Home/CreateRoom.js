import React, { Component, useEffect, useRef } from "react";
import Axios from "axios";
import clientSocket from "../../ClientSocket.js";
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";

class CreateRoom extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      createRoom: false,
      roomCode: "",
      redirectToLobby : false
    };
  }

  // determines whether or not "create room" is shown
  handleShowCreateRoom = event => {
    this.setState({ createRoom: !this.state.createRoom });
    event.preventDefault();
  };

  // handles changes to text field for room code
  handleChangeCreateRoom = event => {
    this.setState({
      roomCode: event.target.value
    });
  };

  // submits room code to database
  handleSubmitCreateRoom = event => {
    event.preventDefault();

    // checks if the room exists
    this.checkExistence(this.state.roomCode);

    // clears the roomCode field
    this.setState({ roomCode: "" });
  };

  // get request to see if it exists (true if it exists)
  async checkExistence(roomCode) {
    try {
      await Axios.get(`http://localhost:5000/homeLobby/${roomCode}`).then(
        res => {

          const allRooms = res.data;

          if (allRooms.length > 0) {
            alert("This room already exists, please choose another name");
          } else {
            this.createRoom(roomCode);
            this.addUserToRoom(roomCode);
          }
        },
        error => {
          console.log(error);
        }
      );
    } catch (error) {
      console.log("There was an error with Axios getRoom");
    }
  }

  // post request to create new room
  async createRoom(roomCode) {
    try {
      await Axios.post("http://localhost:5000/homeLobby", { roomCode: roomCode, users: {socket: clientSocket.id } }); 

      // adds user to socket room
      clientSocket.emit("moveRoom", (roomCode));

      // handles update of the players in the room
      clientSocket.emit("reqUsersInRoom");
      clientSocket.emit("reqSocketRoom");

      // redirects user to lobby
      this.setState({
        redirectToLobby : true
      });

    } catch (error) {
      console.log("There was an error with post");
    }
  }

  async addUserToRoom(roomCode) {
    try {
      await Axios.post("http://localhost:5000/user", { roomCode: roomCode, name: clientSocket.id, socket: clientSocket.id});
    } catch (error) {
      console.log("There was an error adding the user to the room homelobbies room");
    }
  }

  render() {
    return (
      <div>
        <h2 onClick={this.handleShowCreateRoom}>or, create a room</h2>
        {this.state.createRoom ? (
          <form onSubmit={this.handleSubmitCreateRoom}>
            <label>
              Enter a roomcode to create a room:
              <input name="code" type="text" value={this.state.roomCode} onChange={this.handleChangeCreateRoom} />
            </label>
          </form>
        ) : null}
        {this.state.redirectToLobby ? (<Redirect to="/lobby" />) : null}
      </div>
    );
  }
}

export default CreateRoom;
