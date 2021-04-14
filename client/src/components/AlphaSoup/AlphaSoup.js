import React, { Component } from 'react';
import clientSocket from '../../ClientSocket.js';
import Axios from "axios";

import SubmitWord from './SubmitWord.js';
import Letters from './Letters.js';
import LetterVote from './LetterVote.js';
import Chat from '../Chat/Chat.js';
import PlayerData from './PlayerData.js';
import RoomSwitch from './RoomSwitch.js';

class AlphaSoup extends React.Component {

  constructor(props) {
    super(props);
    this.state = {

      letters: [],
      playerData: [],

    }
  }



  // ------------------------------------ Socket.io ------------------------------------

  componentDidMount() {

    // removes word from the list of letters
    clientSocket.on("recCreateWord", (word) => {
      this.removeLetters(word);
    });

    // updates list of all users words
    clientSocket.on("recUpdateWords", (room) => {
      this.updatePlayerData(room);
    });
  }

  componentWillUnmount() {
    clientSocket.off("recCreateWord");
    clientSocket.off("recUpdateWords");
  }



  // ------------------------------------ Axios ------------------------------------

  // updates all playerData
  async updatePlayerData(room) {
    try {
      await Axios.get(`http://localhost:5000/user/byRoom/${room}`).then(
        res => {

          // retrievedPlayerData contains all the user information
          const retrievedPlayerData = res.data;

          let playerData = [];
          
          for (var i = 0; i < retrievedPlayerData.length; i++) {

            // construct object for each player
            let player = {
              username: retrievedPlayerData[i].name,
              points: 0,
              wordsOwned: []
            };

            for (var j = 0; j < retrievedPlayerData[i].wordsOwned.length; j++) {

              // construct object for each word
              let wordData = {
                word: retrievedPlayerData[i].wordsOwned[j].word,
                points: retrievedPlayerData[i].wordsOwned[j].points,
                beingStolen: false
              };

              player.points += retrievedPlayerData[i].wordsOwned[j].points;

              // push the word object to the list of words for the player
              player.wordsOwned.push(wordData);
            }

            // push the player object to the list of players
            playerData.push(player);
          }

          // sorts the players by how many points they have
          playerData.sort(function (a, b) {
            return b.points - a.points;
          });

          // assigns every player a place attribute, indicating what their ranking is relative to the other players
          for (var i = 0; i < playerData.length; i++) {
            playerData[i].place = i + 1;
          }

          // update old playerData with new playerData
          this.setState({
            playerData: playerData
          });
        }
      );
    }
    catch (error) {
      console.log("there was an error with retrieving the words of each player");
    }
  }



  // ------------------------------------ Utility ------------------------------------

  // adds a letter to the list of letters
  addLetter = (letter) => {

    console.log(letter);
    let newLetters = [...this.state.letters];
    newLetters.push(letter);

    this.setState({
      letters: newLetters
    });
  };

  // helper function for removeLetters that removes the first occurence of a letter in a list
  removeFirst = (src, element) => {
    const index = src.indexOf(element);
    if (index === -1) return src;
    return [...src.slice(0, index), ...src.slice(index + 1)];
  }

  // removes all letters in the word from the list of letters  
  removeLetters = (word) => {
    let newLetters = [...this.state.letters];

    for (var i = 0; i < word.length; i++) {
      newLetters = this.removeFirst(newLetters, word.charAt(i));
    }

    this.setState({
      letters: newLetters
    });
  };

  changeStealStatus = (player, word) => {
    let copyPlayerData = [...this.state.playerData];

    // loop through all of the players
    for (let i = 0; i < copyPlayerData.length; i++) {

      // find the player that owns word
      if (copyPlayerData[i].username === player) {

        // loop through the player's words
        for (let j = 0; j < copyPlayerData[i].wordsOwned.length; j++) {

          // find the word that the player owns
          if (copyPlayerData[i].wordsOwned[j].word === word) {

            // set the word to be stolen/unstolen
            copyPlayerData[i].wordsOwned[j].beingStolen = !copyPlayerData[i].wordsOwned[j].beingStolen;
            break;
          }
        }
      }
    }

    this.setState({
      playerData: copyPlayerData
    });
  }



  // ------------------------------------ Render ------------------------------------

  render() {
    return (
      <div>

        <RoomSwitch />
        
        <PlayerData
          playerData={this.state.playerData}

          changeStealStatus={(player, word) => this.changeStealStatus(player, word)}
        />

        <SubmitWord 
          letters={this.state.letters}
          playerData={this.state.playerData}
          
          removeLetters={(word) => this.removeLetters(word)}
        />

        <LetterVote 
          voted={this.state.votedForNextLetter}
          votesForNextLetter={this.state.votesForNextLetter}
          numPlayers={this.state.playerData.length}


          changeVote={(vote) => this.changeVote(vote)}
          changeVoteStatus={(vote) => this.changeVoteStatus(vote)}
        />

        <Letters 
          numLetters={this.state.letters.length}
          letters={this.state.letters}


          addLetter={(letter) => this.addLetter(letter)} 
        />

        <Chat />

      </div>
    );
  }
}

export default AlphaSoup;
