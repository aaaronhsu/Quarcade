import React, { Component } from "react";
import Axios from "axios";

class CreateRoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      createRoom: false,
      code: ""
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleClick(event) {
    alert("Click happened!");
    this.setState({ createRoom: !this.state.createRoom });
    event.preventDefault();
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
    this.setState({ code: blank });
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
      <div>
        <h2 onClick={this.handleClick}>or, create a room</h2>
        {this.state.createRoom ? (
          <form onSubmit={this.handleSubmit}>
            <label>
              Room Code:
              <input name="code" type="text" value={this.state.code} onChange={this.handleChange} />
            </label>
            <input type="submit" value="Submit" />
          </form>
        ) : null}
      </div>
    );
  }
}

export default CreateRoom;
