import React, { Component } from 'react';
import ReadyButton from './ReadyButton.js';

import clientSocket from "../../ClientSocket.js";

class ChooseGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      votesAlphaSoup: 0,
      votesCodeNames: 0,
      gameVoted: "" // this is the game that the player currently has their vote for
    }
  }

  // ------------------------------------ Socket.io ------------------------------------
  
  componentDidMount() {
    clientSocket.on("recAddVoteAlphaSoup", () => {
      const newVoteNum = this.state.votesAlphaSoup + 1;
      this.setState({votesAlphaSoup: newVoteNum});
    });

    clientSocket.on("recAddVoteCodeNames", () => {
      const newVoteNum = this.state.votesCodeNames + 1;
      this.setState({votesCodeNames: newVoteNum});
    })

  }

  componentWillUnmount() {
    clientSocket.off("recAddVoteAlphaSoup");
    clientSocket.off("recAddVotesCodeNames");
  }

  
  // ------------------------------------ Form & Button Handling ------------------------------------

  handleVoteAlphaSoup = (event) => {
    event.preventDefault();
    // alert("chose alphaSoup");
    // then there should be an if to check if already voted alpha
    clientSocket.emit("reqAddVoteAlphaSoup");
  }

  handleVoteCodeNames = (event) => {
    event.preventDefault();
    //alert("chose codeNames");
    clientSocket.emit("reqAddVoteCodeNames");
  }



  // ------------------------------------ Render ------------------------------------

  // need to connect game selection with backend database
  render() {
    return (
      <div>
        <h1>Games! (click one to vote)</h1>
        <h2 onClick={this.handleVoteAlphaSoup}>AlphaSoup (votes: {this.state.votesAlphaSoup})</h2>
        <h2 onClick={this.handleVoteCodeNames}>CodeNames (votes: {this.state.votesCodeNames})</h2>
        <br></br>
        <br></br>
        <ReadyButton
          key={this.state.votedGame}
          votedGame={this.state.votedGame}
        />
      </div>
    );
  }
}

export default ChooseGame;
