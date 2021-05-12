import React, { Component } from "react";
import Axios from "axios";
import clientSocket from "../../ClientSocket.js";

import './Chat.css';

class Chat extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: [],

      message: "",      
    };
  }

  componentDidMount() {
    // appends message to list of messages
    clientSocket.on("recMessage", ({ message, user }) => {
      let messages = [...this.state.messages];

      messages.push({ username: user, message: message });

      if (messages.length > 10) messages.shift();

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

    if (this.state.message === "") return;

    clientSocket.emit("sendMessage", this.state.message);

    // resets message state
    this.setState({ message: "" });
  };

  checkRoom = () => {
    clientSocket.emit("reqSocketRoom");
  };
 
  render() {
    return (
      <div class="chat">

        <h1 class="chat-title">Chat</h1>

        <div>
          {
            this.state.messages.map(message => (
              <p class="chat-message">
                <span class="chat-sender">{message.username}</span>: <span class="chat-text">{message.message}</span>
                <br></br>
              </p>
            ))
          }
        </div>

        <form class="chat-form" onSubmit={this.handleSubmitMessage}>
          <label>
           <input class="chat-message-input" name="message" placeholder="Send a Message!" type="text" value={this.state.message} onChange={this.handleChangeMessage} />
          </label>
        </form>


      </div>
    );
  }
}

export default Chat;
