import React, { Component } from "react";
import Axios from "axios";
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
    socket.on("recMessage", ({ message, user }) => {
      let cMessages = [...this.state.messages];

      const tempUser = user + ": ";

      cMessages.push({ user: tempUser, words: message });

      this.setState({ messages: cMessages });
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

    socket.emit("sendMessage", this.state.message);

    this.setState({ message: "" });
  };

  render() {
    return (
      <div>
        <h1>Chat!</h1>
        <form onSubmit={this.handleSubmit}>
          <label>
            Send Message:
            <input name="message" type="text" value={this.state.message} onChange={this.handleChange} />
          </label>
          {/* <input type="submit" value="Submit" /> */}
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
