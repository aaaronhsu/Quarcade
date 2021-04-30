import React, { Component } from "react";
import clientSocket from '../../ClientSocket.js';

class PlayerData extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  componentDidMount() {
    clientSocket.on("recVoteValidWord", (data) => {
      console.log("attempting to validate word", data.word, "from player", data.username);
      this.props.voteValidWord(data.username, data.word);
    });
  }

  componentWillUnmount() {
    clientSocket.off("recVoteValidWord");
  }

  voteValidWord = (username, wd) => {
    let data = {
      username: username,
      word: wd
    };

    this.props.changeVoteValidWordStatus(username, wd);

    clientSocket.emit("reqVoteValidWord", (data));
  }

  render() {
    return (
      <div>

        <h2>These are the words each player has:</h2>

        {
          this.props.playerData.map(player => (
            <div key={player.id}>
              <h3>{player.username} ({player.points} pts):</h3>

              <ul>
              {
                player.wordsOwned.map(word => (
                  <div>
                    {
                      word.votedToValidate ?

                      null
                      :
                      <button onClick={(username, wd) => this.voteValidWord(player.username, word.word)}>
                        Press this to vote to validate the word
                      </button>
                    }

                    {
                      word.beingStolen ?
                      <li key={word.id} onClick={() => this.props.changeStealStatus(player.username, word.word)}>{word.word} ({word.points}, {word.valid ? "valid" : "invalid"}) (being stolen)</li>
                      :
                      <li key={word.id} onClick={() => this.props.changeStealStatus(player.username, word.word)}>{word.word} ({word.points}, {word.valid ? "valid" : "invalid"})</li>
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