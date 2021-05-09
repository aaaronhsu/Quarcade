import React, { Component } from 'react';
import Axios from 'axios';
import { HashRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";
import StartGameAlphaSoup from './StartGameAlphaSoup.js';

import clientSocket from "../../ClientSocket.js";


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
      // startCodeNames: false // for when we eventually implement codenames

      numPlayers: 0
    }
  }

  // ------------------------------------ Socket.io ------------------------------------
  
  componentDidMount() {

    // when the component mounts, get the roomCode
    clientSocket.emit("reqSocketRoom");
    // receive the room and change the state
    clientSocket.on("recSocketRoom", (room) => {
      this.setState({
        roomCode: room
      })
      // DONE: When component mounts, get current votes in Alpha and Code
      this.pullRoomVotes();
    })

    // once any socket disconnects, repull room votes
    clientSocket.on("clientDisconnected", () => {
      clientSocket.emit("reqUsersInRoom");
      // wipe the whole state lol
      this.setState({
        votesAlphaSoup: 0,
        votesCodeNames: 0,
        gameVoted: "",
        readyAlphaSoup: false,
        readyCodeNames: false,
        startAlphaSoup: false
      })
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
      this.comparePlayersAndVotes();
      
    });

    clientSocket.on("recRemoveVoteCodeNames", () => {
      const newVoteNum = this.state.votesCodeNames - 1;
      this.setState({
        votesCodeNames: newVoteNum,
      });
      this.comparePlayersAndVotes();
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
      // UPON THE STARTING OF ANY GAME, WIPE ALL THE VOTES
      this.clearVoteCounts();
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
    clientSocket.off("clientDisconnected");

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
        // removes a vote from codenames
        this.updateCodeNamesVotes(-1);
      }
      clientSocket.emit("reqAddVoteAlphaSoup");
      this.setState({gameVoted: "AlphaSoup"});
      
      this.updateAlphaSoupVotes(1);

    }
  }

  handleVoteCodeNames = (event) => {
    event.preventDefault();
    // if you didn't already vote for codenames increase votes
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
    // console.log("pulled on comp did mount")
    try {
      await Axios.get(`http://localhost:5000/homeLobby/${this.state.roomCode}`).then(
        res => {
          const roomGot = res.data[0];
          const newAlphaSoupVotes = roomGot.votesAlphaSoup;
          const newCodeNamesVotes = roomGot.votesCodeNames;
          const numPlayers = roomGot.users.length;

          // console.log(roomGot.users.length);

          // new votes counts
          this.setState({
            votesAlphaSoup: newAlphaSoupVotes,
            votesCodeNames: newCodeNamesVotes,
            numPlayers: numPlayers
          })

          // once it's done reseting state, check if start buttons change
          this.comparePlayersAndVotes();

        }
      )
      // get info
    } catch (error) {
      console.log("could not get the current state of votes");
    }
  }

  async updateAlphaSoupVotes(change) {
    const newValue = this.state.votesAlphaSoup + change;
    // console.log(newValue);
    try {
      await Axios.patch(`http://localhost:5000/homeLobby/changeVotesAlphaSoup/${this.state.roomCode}`, {votesAlphaSoup: newValue}).then(
        // console.log("patched remove")
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

  comparePlayersAndVotes = () => {
    if (this.state.votesAlphaSoup < this.state.numPlayers) {
      this.setState({readyAlphaSoup: false});
    }
    if (this.state.votesCodeNames < this.state.numPlayers) {
      this.setState({readyCodenames: false});
    }
  }

  async clearVoteCounts() {
    try {
      await Axios.patch(`http://localhost:5000/homeLobby/wipeVotes/${this.state.roomCode}`, {votesAlphaSoup: 0, votesCodeNames: 0});
    } catch (error) {
      console.log("could not patch to set votes to 0");
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
        {this.state.startAlphaSoup ? (<Redirect to="/alphasoup" />) : null}
        {/* EVENTUALLY SAME AS ABOVE FOR CODENAMES */}

      </div>
    );
  }
}

export default ChooseGame;
