import React, { Component } from 'react';
import ReadyButton from './ReadyButton.js';

import clientSocket from "../../ClientSocket.js";

class ChooseGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      votesAlphaSoup: 0,
      votesCodeNames: 0,
      gameVoted: "", // this is the game that the player currently has their vote for
    }
  }

  // ------------------------------------ Socket.io ------------------------------------
  
  componentDidMount() {
    clientSocket.on("recAddVoteAlphaSoup", () => {
      const newVoteNum = this.state.votesAlphaSoup + 1;
      this.setState({
        votesAlphaSoup: newVoteNum,
      });
    });

    clientSocket.on("recAddVoteCodeNames", () => {
      const newVoteNum = this.state.votesCodeNames + 1;
      this.setState({
        votesCodeNames: newVoteNum,
      });
    });

    clientSocket.on("recRemoveVoteAlphaSoup", () => {
      const newVoteNum = this.state.votesAlphaSoup - 1;
      this.setState({
        votesAlphaSoup: newVoteNum,
      });
    });

    clientSocket.on("recRemoveVoteCodeNames", () => {
      const newVoteNum = this.state.votesCodeNames - 1;
      this.setState({
        votesCodeNames: newVoteNum,
      });
    });

  }

  componentWillUnmount() {
    clientSocket.off("recAddVoteAlphaSoup");
    clientSocket.off("recAddVotesCodeNames");
    clientSocket.off("recRemoveVotesAlphaSoup");
    clientSocket.off("recRemoveVotesCodeNames");
  }

  
  // ------------------------------------ Form & Button Handling ------------------------------------

  handleVoteAlphaSoup = (event) => {
    event.preventDefault();

    // if you didn't already vote for alpha, increase votes
    if (this.state.gameVoted === "AlphaSoup") {
      // do nothing
    } else {
      // check if you are switching from CodeNames
      if (this.state.gameVoted === "CodeNames") {
        // remove a vote from CodeNames first
        clientSocket.emit("reqRemoveVoteCodeNames");
      }
      clientSocket.emit("reqAddVoteAlphaSoup");
      this.setState({gameVoted: "AlphaSoup"});
    }
  }

  handleVoteCodeNames = (event) => {
    event.preventDefault();
    // if you didn't already vote for codenames incrase votes
    if (this.state.gameVoted === "CodeNames") {
      // do nothing
    } else {
      // check if you are switching from AlphaSoup
      if (this.state.gameVoted === "AlphaSoup") {
        // remove a vote from CodeNames first
        clientSocket.emit("reqRemoveVoteAlphaSoup");
      }
      clientSocket.emit("reqAddVoteCodeNames");
      this.setState({gameVoted: "CodeNames"});
    }
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
