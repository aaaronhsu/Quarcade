import React, { Component } from 'react';
import clientSocket from '../../ClientSocket.js';

class EndScreen extends React.Component {
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
      </div>
    );
  }
}

export default EndScreen;