import React, { Component } from "react";
import socket from "../../ClientSocket.js";

class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      message: "",
      sender: ""
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

    this.state.messages.push(this.state.message);

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
              {message}
              <br></br>
            </small>
          ))}
        </div>
      </div>
    );
  }
}

export default Chat;
