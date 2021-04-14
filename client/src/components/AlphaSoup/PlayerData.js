import React, { Component } from "react";

class PlayerData extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      wordsStealing: [

      ],
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
                    <li key={word.id}>{word.word} ({word.points})</li>
                    {console.log(word.word)}
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