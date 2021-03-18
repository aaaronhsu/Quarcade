import React, { Component } from "react";
import socket from "../../ClientSocket.js";

class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [
        {
          user: "",
          words: ""
        }
      ],
      message: "",
      myRoom: "",
      myName: ""
    };
  }

  componentDidMount() {
    socket.on("getSocketRoom", room => {
      this.setState({ myRoom: room });
    });
  }

  handleChange = event => {
    const message = event.target.value;

    this.setState({
      message: message
    });
  };

  handleSubmit = event => {
    event.preventDefault();

    // requests the room, this adds the room to the state
    socket.emit("requestSocketRoom");

    //get the username by the room that it's in and its socket
    this.findUserName(this.state.myRoom);

    // name should be axios.get(roomCode/user/name) but not yet!
    let tempName = "bob1" + ": ";

    this.state.messages.push({ user: tempName, words: this.state.message });

    this.setState({ message: "" });
  };

  async findUserName(roomCode) {
    try {
      await Axios.get(`http://localhost:5000/homeLobby/${roomCode}`)
        .then
        //loop through the user data by the socket.id to find the name
        //res.data.users()

        //lastly, update the user with the user info
        ();
    } catch (error) {
      console.log("Could not find that room: " + roomCode);
    }
  }

  render() {
    return (
      <div>
        <h1>Chat!</h1>
        <form onSubmit={this.handleSubmit}>
          <label>
            Send Message:
            <input name="message" type="text" value={this.state.message} onChange={this.handleChange} />
          </label>
          <input type="submit" value="Submit" />
        </form>
        <h3>See Messages Below:</h3>
        <div>
          {this.state.messages.map(message => (
            <small>
              {message.user}
              {message.words}
              <br></br>
            </small>
          ))}
        </div>
      </div>
    );
  }
}

export default Chat;
