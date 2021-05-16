import React, { Component } from "react";
import clientSocket from '../../ClientSocket.js';

import "./PlayerData.css";

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

  renderKey = () => {
    return (
      <div class="playerData-keybox">
        <h3 class="playerData-keyhead">
          <span class="playerData-valid playerData-key"> Valid </span> |
          <span class="playerData-steal playerData-key"> Stealing </span> | 
          <span class="playerData-invalid playerData-key"> Invalid </span> |
          <span class="playerData-validate playerData-key"> Validating</span>
        </h3> 
      </div>
    );
  }

  render() {
    return (
      <div>
        <div class="playerData">

          {this.renderKey()}

          <div class="playerData-players">
            {
              this.props.playerData.map(player => (
                <div class="playerData-player">
                  <h2>{player.username} ({player.points} pts)</h2>

                  <ul>
                    {
                      player.wordsOwned.map(word => (
                        <div>
                          {
                            word.valid ?

                            <div>
                              {
                                word.beingStolen ?
                                <div>
                                  <li>
                                    <span class="playerData-stealingword playerData-word" onClick={() => this.props.changeStealStatus(player.username, word.word)}>
                                      {word.word} ({word.points}, being stolen)
                                    </span>
                                  </li>
                                </div>
                                :
                                <div>
                                  <li>
                                    <span class="playerData-word" onClick={() => this.props.changeStealStatus(player.username, word.word)}>
                                      {word.word} ({word.points})
                                    </span>
                                  </li>
                                </div>
                              }
                            </div>
                            :
                            <div class="playerData-invalidword">
                              {
                                word.votedToValidate ?
                                <div>
                                  <li>
                                    <span class="playerData-validatingword">
                                      {word.word} ({word.points}) ({this.props.playerData.length - word.votesToValidate}/{this.props.playerData.length} validated)
                                    </span>
                                  </li>
                                </div>
                                :
                                <div>
                                  {
                                    <div>
                                      <li>
                                        <span class="playerData-invalidword" onClick={(username, wd) => this.voteValidWord(player.username, word.word)}>
                                          {word.word} ({word.points}) ({this.props.playerData.length - word.votesToValidate}/{this.props.playerData.length} validated)
                                        </span>
                                      </li>
                                    </div>
                                  }
                                </div>
                              }
                            </div>
                          }
                        </div>
                      ))
                    }
                  </ul>
                </div>
              ))
            }
          </div>
        </div>

        
      </div>
    );
  }
}

export default PlayerData;