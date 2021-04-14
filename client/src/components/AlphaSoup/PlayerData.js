import React, { Component } from "react";

class PlayerData extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  render() {
    return (
      <div>

        <h2>These are the words each player has:</h2>

        {
          this.props.playerData.map(player => (
            <div key={player.id}>
              <h3>{player.username} ({player.points}, #{player.place}):</h3>

              <ul>
              {
                player.wordsOwned.map(word => (
                  <div>
                    {
                      word.beingStolen ?
                      <li key={word.id} onClick={() => this.props.changeStealStatus(player.username, word.word)}>{word.word} ({word.points}) (being stolen)</li>
                      :
                      <li key={word.id} onClick={() => this.props.changeStealStatus(player.username, word.word)}>{word.word} ({word.points})</li>
                    }
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

export default PlayerData;