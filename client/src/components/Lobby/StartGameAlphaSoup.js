import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";

import clientSocket from "../../ClientSocket.js"; 

class StartGameAlphaSoup extends React.Component {
  constructor(props) {
    super(props);
  }



  // ------------------------------------ Form & Button Handling ------------------------------------
  
  handleStartAlphaSoup = () => {
    // emit message for all to start alphaSoup
    clientSocket.emit("reqStartAlphaSoup");
  }

  // ------------------------------------ Render ------------------------------------

  render() {
    return (
      <div>
        <button onClick={this.handleStartAlphaSoup}>Start Game</button>
      </div>
    );
  }
}

export default StartGameAlphaSoup;
