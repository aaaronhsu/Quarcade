import React, { Component } from 'react';
import Axios from 'axios';
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";
import StartGameAlphaSoup from './StartGameAlphaSoup.js';

import clientSocket from "../../ClientSocket.js";

// right now ready button is not being used at all
import ReadyButton from './ReadyButton.js';

class ChooseGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      votesAlphaSoup: 0,
      votesCodeNames: 0,
      gameVoted: "", // this is the game that the player currently has their vote for
      roomCode: "", // should get the roomcode at the beginning to request
      readyAlphaSoup: false, // whether all players have votes for the same thing yet
      readyCodeNames: false,
      startAlphaSoup: false, // whether alphasoup should start or not

      numPlayers: 0
    }
  }

  // ------------------------------------ Socket.io ------------------------------------
  
  componentDidMount() {
    // ERROR- when a user joins, shd remove start game!!!! need to set state back to false
    // ERROR 2- all sockets add to database, not just one so votes are too big

    // when the component mounts, get the roomCode
    clientSocket.once("reqSocketRoom");
    // receive the room and change the state
    clientSocket.on("recSocketRoom", (room) => {
      this.setState({
        roomCode: room
      })
      // DONE: When component mounts, get current votes in Alpha and Code
      this.pullRoomVotes();
    })

    clientSocket.on("recAddVoteAlphaSoup", () => {
      const newVoteNum = this.state.votesAlphaSoup + 1;
      this.setState({
        votesAlphaSoup: newVoteNum,
      });

      // check if you are ready to start
      // compare the votes in alphasoup to the people in the room
      this.compareVoteCounts(this.state.votesAlphaSoup, "AlphaSoup");
    });

    clientSocket.on("recAddVoteCodeNames", () => {
      const newVoteNum = this.state.votesCodeNames + 1;
      this.setState({
        votesCodeNames: newVoteNum,
      });

      // check if you are ready to start
      // compare users in the roomCode to the votes in the state
      this.compareVoteCounts(this.state.votesCodeNames, "CodeNames");
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

    // to get prepared to start (unanimous vote on a game)
    clientSocket.on("recStart", (game) => {
      // console.log("received request to start");

      //TOD0: make it wait a bit before changing rooms
      if (game === "AlphaSoup") {
        this.setState({readyAlphaSoup: true})
      }
      if (game === "CodeNames") {
        this.setState({readyCodeNames: true})
      }
    })

    // to start the alphaSoupGame
    clientSocket.on("recStartAlphaSoup", () => {
      this.setState({startAlphaSoup: true});
      // TODO: UPON THE STARTING OF ANY GAME, WIPE ALL THE VOTES
    })

  }

  componentWillUnmount() {
    clientSocket.off("recSocketRoom");
    clientSocket.off("recAddVoteAlphaSoup");
    clientSocket.off("recAddVotesCodeNames");
    clientSocket.off("recRemoveVotesAlphaSoup");
    clientSocket.off("recRemoveVotesCodeNames");
    clientSocket.off("recStart");
    clientSocket.off("recStartAlphaSoup");

  }

  
  // ------------------------------------ Form & Button Handling ------------------------------------

  handleVoteAlphaSoup = (event) => {
    event.preventDefault();

    // if you didn't already vote for alpha, increase votes
    if (this.state.gameVoted === "AlphaSoup") {
      // remove a vote
      clientSocket.emit("reqRemoveVoteAlphaSoup");
      // switch state back to no game voted
      this.setState({gameVoted: ""});
      this.updateAlphaSoupVotes(-1);
    } else {
      // check if you are switching from CodeNames
      if (this.state.gameVoted === "CodeNames") {
        // remove a vote from CodeNames first
        clientSocket.emit("reqRemoveVoteCodeNames");
        // TODO: DATABASE CODENAMES
        this.updateCodeNamesVotes(-1);
      }
      clientSocket.emit("reqAddVoteAlphaSoup");
      this.setState({gameVoted: "AlphaSoup"});
      
      this.updateAlphaSoupVotes(1);

    }
  }

  handleVoteCodeNames = (event) => {
    event.preventDefault();
    // if you didn't already vote for codenames incrase votes
    if (this.state.gameVoted === "CodeNames") {
      clientSocket.emit("reqRemoveVoteCodeNames");
      // switch state back to no game voted
      this.setState({gameVoted: ""});
      this.updateCodeNamesVotes(-1);
    } else {
      // check if you are switching from AlphaSoup
      if (this.state.gameVoted === "AlphaSoup") {
        // remove a vote from CodeNames first
        clientSocket.emit("reqRemoveVoteAlphaSoup");
        this.updateAlphaSoupVotes(-1);
      }
      clientSocket.emit("reqAddVoteCodeNames");
      this.setState({gameVoted: "CodeNames"});
      this.updateCodeNamesVotes(1);
    }
  }

  async compareVoteCounts(votes, game) {
    try {
      await Axios.get(`http://localhost:5000/user/byRoom/${this.state.roomCode}`).then(
        res => {
          const playerCount = res.data.length;
          // console.log(playerCount);
          // console.log(votes);
          if (playerCount === votes) {
            // ask to start game
            // console.log("emitted because " + votes + "=" + playerCount)
            // console.log("game");
            clientSocket.emit("reqStart", game);
          }
           
        }
      )
    } catch (error) {
      console.log("could not get users by room");
    }
  }

  async pullRoomVotes() {
    // console.log(this.state.roomCode);
    try {
      await Axios.get(`http://localhost:5000/homeLobby/${this.state.roomCode}`).then(
        res => {
          const roomGot = res.data[0];
          const newAlphaSoupVotes = roomGot.votesAlphaSoup;
          const newCodeNamesVotes = roomGot.votesCodeNames;
          const numPlayers = roomGot.users.length;

          console.log(roomGot.users);

          // new votes counts
          this.setState({
            votesAlphaSoup: newAlphaSoupVotes,
            votesCodeNames: newCodeNamesVotes,
            numPlayers: numPlayers
          })

        }
      )
      // get info
    } catch (error) {
      console.log("could not get the current state of votes");
    }
  }

  async updateAlphaSoupVotes(change) {
    const newValue = this.state.votesAlphaSoup + change;
    console.log(newValue);
    try {
      await Axios.patch(`http://localhost:5000/homeLobby/changeVotesAlphaSoup/${this.state.roomCode}`, {votesAlphaSoup: newValue}).then(
        console.log("patched remove")
      );
    } catch (error) {
      console.log("could not patch the values AlphaSoup");
    }
  }

  async updateCodeNamesVotes(change) {
    const newValue = this.state.votesCodeNames + change;
    try {
      await Axios.patch(`http://localhost:5000/homeLobby/changeVotesCodeNames/${this.state.roomCode}`, {votesCodeNames: newValue});
    } catch (error) {
      console.log("could not patch the values CodeNames");
    }
  }



  // ------------------------------------ Render ------------------------------------

  // need to connect game selection with backend database
  render() {
    return (
      <div>
        <h1>Games! (click one to vote)</h1>
        <h2 onClick={this.handleVoteAlphaSoup}>AlphaSoup (votes: {this.state.votesAlphaSoup} / {this.state.numPlayers})</h2>
        {this.state.readyAlphaSoup ? <StartGameAlphaSoup/>: null}
        <h2 onClick={this.handleVoteCodeNames}>CodeNames (votes: {this.state.votesCodeNames} / {this.state.numPlayers})</h2>
        {/*this.state.readyCodeNames ? (start codename component here) : null */}
      </div>
    );
  }
}

export default ChooseGame;
