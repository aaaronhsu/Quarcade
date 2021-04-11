import React, { Component } from "react";
import Axios from "axios";
import clientSocket from "../../ClientSocket.js";

class Chat extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: [
        {
          username: "",
          message: ""
        }
      ],

      message: "",      
    };
  }

  componentDidMount() {
    // appends message to list of messages
    clientSocket.on("recMessage", ({ message, user }) => {
      let messages = [...this.state.messages];

      messages.push({ username: user, message: message });

      this.setState({ messages: messages });
    });
  }

  componentWillUnmount() {
    clientSocket.off("recMessage");
  }

  // updates the message state
  handleChangeMessage = event => {
    const message = event.target.value;

    this.setState({
      message: message
    });
  };

  // requests message to be created
  handleSubmitMessage = event => {
    event.preventDefault();

    clientSocket.emit("sendMessage", this.state.message);

    // resets message state
    this.setState({ message: "" });
  };

  render() {
    return (
      <div>
        <h1>Chat!</h1>

        <form onSubmit={this.handleSubmitMessage}>
          <label>
            Send Message:
            <input name="message" type="text" value={this.state.message} onChange={this.handleChangeMessage} />
          </label>
        </form>

        <h3>See Messages Below:</h3>

        <div>

          {this.state.messages.map(message => (
            <small>
              {message.username}
              {message.message}
              <br></br>
            </small>
          ))}

        </div>

      </div>
    );
  }
}

export default Chat;
