import React, { Component } from 'react';
import clientSocket from '../../ClientSocket.js';
import Axios from 'axios';
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";


class EndScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playersVotedToPlayAgain: 0,
      votedToPlayAgain: false,
      playAgainButton: true,
      returnToLobby: false, 
    }
  }



  // ------------------------------------ Socket.io ------------------------------------

  componentDidMount() {
    clientSocket.on("recUserLeftEndScreen", () => {
      this.setState({
        playAgainButton: false
      });
    });

    clientSocket.on("recReplayAlphaSoup", (vote) => {
      this.setState({
        playersVotedToPlayAgain: this.state.playersVotedToPlayAgain + vote
      });
    });

    clientSocket.on("recWipeWordsOwned", () => {
      this.wipeWordsOwned("alphaSoupAgain");
    })
  }

  componentWillUnmount() {
    clientSocket.off("userLeftEndScreen");
    clientSocket.off("recReplayAlphaSoup");
    clientSocket.off("recWipeWordsOwned");
  }



  // ------------------------------------ Axios ------------------------------------

  // deletes all the data from the wordsOwned array in users

  // TODO- add parameter to wipe words owned (wipe to lobby or wipe to alpha)

  // YES HERE!
  async wipeWordsOwned(place) {
    try {
      // wipe the wordcount array by socketid
      await Axios.patch(`http://localhost:5000/user/clear/${clientSocket.id}`).then(
        req => {
          // if lobby, DO NOT request switch, else, do
          if (place === "lobby") {
            // do not emit anything
          } else {
            clientSocket.emit("reqSwitchBackToAlphaGamePage")
          }
        // switch back to other alphaSoup page
        }
      );

    } catch (error) {
      console.log("could not wipe the user wordsOwned data");
    }
    
  }

  // removes the alphaSoup version of the room from the database
  async deleteAlphaSoupRoom() {
    try {
      await Axios.delete(`http://localhost:5000/alphaSoup/${this.props.roomCode}`);
    } catch (error) {
      console.log("could not delete the room");
    }
  }

  // resets the letters in the alphasoup database (only happens if you play again)
  async resetLettersLeft(players) {
    console.log("player number" + players);
    try {
      await Axios.patch(`http://localhost:5000/alphaSoup/setLettersLeft/${this.props.roomCode}`, {lettersLeft: players * 15}).then(
        // wipe the wordsOwned array from all the users
        clientSocket.emit("reqWipeWordsOwned")
      );
    } catch (error) {
      console.log("could not repatch to alphasoup")
    }
  }

  // ------------------------------------ Form & Button Handling ------------------------------------

  handleVotePlayAgain = () => {
    // user is voting to play again
    if (!this.state.votedToPlayAgain) {

      // time to play again!
      if (this.state.playersVotedToPlayAgain + 1 == this.props.playerData.length) {
        console.log("time to play again"); 
        // wipe the alphasoup database- the only thing that needs to change is the letters left
        this.resetLettersLeft(this.props.playerData.length);
      }
      
      clientSocket.emit("reqReplayAlphaSoup", (1));
    }
    else {
      clientSocket.emit("reqReplayAlphaSoup", (-1));
    }

    this.setState({
      votedToPlayAgain: !this.state.votedToPlayAgain
    });
  };

  handleReturnToLobbyScreen = () => {

    clientSocket.emit("reqUserLeftEndScreen");
    clientSocket.emit("reqUsersInRoom");

    // wipe the user from the database
    this.wipeWordsOwned("lobby");
    
    // wipe the room from the database
    this.deleteAlphaSoupRoom();

    // return the user to Lobby.js
    this.setState({returnToLobby: true});
  };



  // ------------------------------------ Render ------------------------------------

  renderPlayerStandings = () => {
    return (
      this.props.playerData.map(player => (
        <div key={player.id}>
          <h3>#{player.rank}: {player.username} ({player.points} pts):</h3>

          <ul>
          {
            player.wordsOwned.map(word => (
              <div>
                <li key={word.id}>{word.word} ({word.points})</li>
              </div>
            ))
          }
          </ul>
        </div>
      ))
    );
  }

  renderLobbyButton = () => {
    return (
      <button onClick={() => this.handleReturnToLobbyScreen()}>
        Return to Lobby
      </button>
    );
  }

  renderPlayAgainButton = () => {
    return (
      this.state.playAgainButton ?

      <div>
        {
          this.state.votedToPlayAgain ?

          <button onClick={() => this.handleVotePlayAgain()}>
            Remove vote to play again
          </button>
          :
          <button onClick={() => this.handleVotePlayAgain()}>
            Vote to play again!
          </button>
        }

        <h3>{this.state.playersVotedToPlayAgain}/{this.props.playerData.length} players have voted to play again</h3>
      </div>
      :
      null
    );
  }

  render() {
    return (
      <div>
        {this.renderPlayerStandings()}

        {this.renderLobbyButton()}

        {this.renderPlayAgainButton()}

        {this.state.returnToLobby ? (<Redirect to="/lobby" />) : null}

      </div>
    );
  }
}

export default EndScreen;