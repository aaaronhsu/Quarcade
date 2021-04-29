import React, { Component } from 'react';
import clientSocket from '../../ClientSocket.js';
import Axios from 'axios';
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";


class EndScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      returnToLobby: false
    }
  }

  returnToLobbyScreen = () => {
    // TODO
    // wipe the user from the database
    this.wipeWordsOwned();
    
    // wipe the room from the database
    this.deleteAlphaSoupRoom();

    // return the user to Lobby.js
  };

  // deletes all the data from the wordsOwned array in users
  async wipeWordsOwned() {
    try {
      // wipe the wordcount array by socketid
      await Axios.patch(`http://localhost:5000/user/clear/${clientSocket.id}`);

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

  render() {
    return (
      <div>
        {
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
        }

        <button onClick={() => this.returnToLobbyScreen()}>
          Return to Lobby
        </button>

        {this.state.returnToLobby ? (<Redirect to="/lobby" />) : null}

      </div>
    );
  }
}

export default EndScreen;