import React, { Component } from "react";
import Axios from "axios";
import clientSocket from "../../ClientSocket.js";

class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
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
    clientSocket.on("recMessage", ({ message, user }) => {
      let cMessages = [...this.state.messages];

      const tempUser = user + ": ";

      cMessages.push({ user: tempUser, words: message });

      this.setState({ messages: cMessages });
    });
  }

  componentWillUnmount() {
    clientSocket.off("recMessage");
  }

  handleChange = event => {
    const message = event.target.value;

    this.setState({
      message: message
    });
  };

  handleSubmit = event => {
    event.preventDefault();

    clientSocket.emit("sendMessage", this.state.message);

    this.setState({ message: "" });
  };

  checkRoom = () => {
    clientSocket.emit("reqSocketRoom");
  };

  openChat = () => {
    this.setState({visible: true});
  }

  closeChat = () => {
    this.setState({visible: false});
  }
 
  render() {
    return (
      <div>
        {this.state.visible ?
          <div>
            <button onClick={this.closeChat}>Hide Chat</button>
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
          :
          <button onClick={this.openChat}>Show Chat</button>
        }

      </div>
    );
  }
}

export default Chat;
