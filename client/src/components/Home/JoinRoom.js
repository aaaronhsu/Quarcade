import React, { Component } from "react";
import Axios from "axios";
import clientSocket from "../../ClientSocket.js";

class JoinRoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      code: ""
    };
  }

  // handles changes to text field for room code
  handleChange = event => {
    const change = event.target.value;
    const name = event.target.name;

    this.setState({
      [name]: change
    });
  };

  // submits room code to database
  handleSubmit = event => {
    event.preventDefault();

    alert("You submitted Room Code to Join: " + this.state.code);

    // need to connect with backend database and implement verification
    let tempName = "temporary name that will be updated in lobby";
    this.checkExistence(this.state.code, tempName);

    //clears the fields, this is just to make it look better
    this.setState({ code: "" });
  };

  // get request to see if it exists, if it doesn't, call post
  async checkExistence(roomCode, tempName) {
    try {
      await Axios.get(`http://localhost:5000/homeLobby/${roomCode}`).then(
        res => {
          const matches = res.data;
          if (matches.length > 0) {
            // this means if it exists you can join
            console.log("chosen a good room");

            // adds user to the room in the database
            Axios.put(`http://localhost:5000/homeLobby/${roomCode}`, { users: {name: tempName, socket: clientSocket.id } })

            // also, there should be something that moves you to the lobby screen

            
          } else {
            alert("This room does not exist");
          }
        },
        error => {
          console.log(error);
        }
      );
    } catch (error) {
      console.log("There was an error with get Room");
    }
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Room Code:
          <input name="code" type="text" value={this.state.code} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

export default JoinRoom;
