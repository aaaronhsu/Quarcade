import React, { Component } from "react";
import Axios from "axios";
import clientSocket from '../../ClientSocket.js';

class JoinRoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      code: ""
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const change = event.target.value;
    const name = event.target.name;

    this.setState({
      [name]: change
    });
  }

  handleSubmit(event) {
    alert("Hi " + this.state.name + " you submitted Room Code: " + this.state.code);
    event.preventDefault();

    // need to connect with backend database and implement verification
    let tempName = "temporary name that will be updated in lobby";
    this.pushCodeToBackend(this.state.code, tempName);

    //clears the fields, this is just to make it look better
    let blank = "";
    this.setState({ name: blank, code: blank });
  }

  async pushCodeToBackend(roomCode, tempName) {
    try {
      await Axios.post("http://localhost:5000/homeLobby", { roomCode: roomCode, users: { name: tempName, socket: clientSocket.id } });
      console.log("Room was succesfully created");
    } catch (error) {
      console.log("There was an error.");
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
