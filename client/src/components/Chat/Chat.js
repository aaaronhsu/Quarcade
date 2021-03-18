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
      message: ""
    };
  }

  handleChange = event => {
    const message = event.target.value;

    this.setState({
      message: message
    });
  };

  handleSubmit = event => {
    event.preventDefault();

    // name should be axios.get(roomCode/user/name) but not yet!
    let tempName = "bob1" + ": ";

    this.state.messages.push({ user: tempName, words: this.state.message });

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
