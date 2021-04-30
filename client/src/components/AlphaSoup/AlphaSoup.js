import React, { Component } from 'react';
import clientSocket from '../../ClientSocket.js';
import Axios from "axios";

import SubmitWord from './SubmitWord.js';
import Letters from './Letters.js';
import LetterVote from './LetterVote.js';
import Chat from '../Chat/Chat.js';
import PlayerData from './PlayerData.js';
import EndScreen from './EndScreen.js';

class AlphaSoup extends React.Component {

  constructor(props) {
    super(props);
    this.state = {

      letters: [],
      playerData: [],

      lettersLeft: -1,
      roomCode: 'not set yet',



      gameEnd: false,
    }
  }



  // ------------------------------------ Socket.io ------------------------------------

  componentDidMount() {
    // requests initial player information to be retrieved
    clientSocket.emit("reqUpdateWords");

    // removes word from the list of letters
    clientSocket.on("recUpdateLetters", (newLetters) => {
      this.updateLetters(newLetters);
    });

    // updates list of all users words
    clientSocket.on("recUpdateWords", (room) => {
      this.updatePlayerData(room);
    });

    clientSocket.on("recLettersLeft", (room) => {
      this.setState({
        roomCode: room
      });

      this.retrieveLettersLeft(room);
    });

    clientSocket.on("recAlphaSoupEnd", () => {
      let copyOfPlayerData = [...this.state.playerData];

      copyOfPlayerData.sort((a, b) => (a.points < b.points) ? 1 : -1);

      for (let i = 0; i < copyOfPlayerData.length; i++) {
        copyOfPlayerData[i].rank = i + 1;
      }

      this.setState({
        gameEnd: true,
        playerData: copyOfPlayerData
      });

    });

    clientSocket.on("recSwitchBackToAlphaGamePage", () => {
      console.log("words have hopefully been wiped");
      this.setState({
        gameEnd: false,
        letters: [],
        playerData: []
      });
      this.updatePlayerData(this.state.roomCode);
      this.retrieveLettersLeft(this.state.roomCode);
    })
  }

  componentWillUnmount() {
    clientSocket.off("recUpdateLetters");
    clientSocket.off("recUpdateWords");
    clientSocket.off("recLettersLeft");
    clientSocket.off("recAlphaSoupEnd");
    clientSocket.off("recSwitchBackToAlphaGamePage");
  }



  // ------------------------------------ Axios ------------------------------------

  // update the number of letters left in the room
  async retrieveLettersLeft(room) {
    try {
      await Axios.get(`http://localhost:5000/alphaSoup/${room}`).then(
        res => {
          // loops through every room to find the room that matches the roomcode
          this.setState({
            lettersLeft: res.data[0].lettersLeft
          });
    
        }
      );
    }
    catch (error) {

    }
  }

  // updates all playerData
  async updatePlayerData(room) {
    // console.log("got to updating player data");
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
                valid: retrievedPlayerData[i].wordsOwned[j].valid,
                votesToValidate: -1, // how many more votes are needed to validate the word
                beingStolen: false
              };

              if (wordData.valid) {
                player.points += retrievedPlayerData[i].wordsOwned[j].points;
              }
              else {
                wordData.votesToValidate = retrievedPlayerData.length - 1; // all players must validate
              }


              // push the word object to the list of words for the player
              player.wordsOwned.push(wordData);
            }

            // push the player object to the list of players
            playerData.push(player);
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

  // updates the number of letters left in the room
  async updateLettersLeft(change) {
    try {
      // patches the data to the alphasoup database

      // console.log("got here");
      await Axios.patch(`http://localhost:5000/alphaSoup/setLettersLeft/${this.state.roomCode}`, { lettersLeft: this.state.lettersLeft - change });
      
    } catch (error) {
      console.log("failed to reduce the number of letters in the room");
    }


    clientSocket.emit("reqLettersLeft");
  }


  // ------------------------------------ Utility ------------------------------------

  // adds a letter to the list of letters
  addLetter = (letter) => {
    
    let newLetters = [...this.state.letters];
    newLetters.push(letter);
    
    this.setState({
      letters: newLetters
    });
  
  };

  // removes all letters in the word from the list of letters  
  updateLetters = (newLetters) => {

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
        {
          this.state.gameEnd ?

          (
            <EndScreen
              playerData={this.state.playerData}
              
              roomCode={this.state.roomCode}
            />
          )
          :
          ( 
            <div>

              LETTERS LEFT: {this.state.lettersLeft}
              
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
                numPlayers={this.state.playerData.length}
                lettersLeft={this.state.lettersLeft}
      
                updateLettersLeft={(change) => this.updateLettersLeft(change)}
              />
      
              <Letters 
                numLetters={this.state.letters.length}
                letters={this.state.letters}
      
      
                addLetter={(letter) => this.addLetter(letter)} 
                updateLettersLeft={(change) => this.updateLettersLeft(change)} // purely for debug purposes
              />
      
              <Chat />

            </div>
          )

        }

      </div>
    );
  }
}

export default AlphaSoup;
