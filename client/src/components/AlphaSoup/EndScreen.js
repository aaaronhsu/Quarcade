import React, { Component } from 'react';
import clientSocket from '../../ClientSocket.js';

class EndScreen extends React.Component {

  returnToLobbyScreen = () => {
    // TODO
    // wipe the user from the database
    // wipe the room from the database
    // return the user to Lobby.js
  };

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
      </div>
    );
  }
}

export default EndScreen;