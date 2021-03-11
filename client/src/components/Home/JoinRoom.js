import React, { Component } from "react";
import Axios from "axios";

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
    let tempName = "holderNameForUser";
    this.pushCodeToBackend(this.state.code, this.state.name);

    //clears the fields, this is just to make it look better
    let blank = "";
    this.setState({ name: blank, code: blank });
  }

  async pushCodeToBackend(roomCode, tempName) {
    try {
      await Axios.post("http://localhost:5000/homeLobby", { roomCode: roomCode, users: { name: tempName, socket: "I HAVE NO IDEA WHAT THIS IS LOL" } });
      console.log("Room was succesfully created");
    } catch (error) {
      console.log("There was an error.");
    }
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <input name="name" type="text" value={this.state.name} onChange={this.handleChange} />
        </label>
        <br />
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
