import React, { Component } from "react";
import socket from "../../ClientSocket.js";

class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: []
    };
  }
  render() {
    return (
      <div>
        <h1>Chat!</h1>
      </div>
    );
  }
}

export default Chat;
