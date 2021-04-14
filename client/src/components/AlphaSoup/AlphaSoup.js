import React, { Component } from 'react';
import clientSocket from '../../ClientSocket.js';
import Axios from "axios";

import SubmitWord from './SubmitWord.js';
import Letters from './Letters.js';
import LetterVote from './LetterVote.js';

import Chat from '../Chat/Chat.js';
import PlayerData from './PlayerData.js';

class AlphaSoup extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      votesForNextLetter: 0,
      votedForNextLetter: false,

      letters: [],

      playerData: [],

    }
  }



  // ------------------------------------ Socket.io ------------------------------------

  componentDidMount() {

    // records the room the socket is in
    clientSocket.on("recSocketRoom", (room) => {
      this.makeSwitch(room);
    });

    // removes word from the list of letters
    clientSocket.on("recCreateWord", (word) => {
      this.removeLetters(word);
    });

    // updates list of all users words
    clientSocket.on("recUpdateWords", (room) => {
      this.retrieveWords(room);
    });
  }

  componentWillUnmount() {
    clientSocket.off("recSocketRoom");
    clientSocket.off("recCreateWord");
    clientSocket.off("recUpdateWords");
  }



  // ------------------------------------ Axios ------------------------------------

  // updates all playerData
  async retrieveWords(room) {
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
                points: retrievedPlayerData[i].wordsOwned[j].points
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

  // takes the room from socket and requests the data
  async makeSwitch(room) {
    try {
      await Axios.get(`http://localhost:5000/homeLobby/${room}`).then(
        res => {
          const roomInfo = res.data[0];
          // logs the info of the room
          // here we do axios.post roomInfo to the room 
          this.addRoom(roomInfo);
        }
      )
    } catch (error) {
      console.log("Could not get that room");
    }
  }

  // adds a clone of the room from homelobbies to alphasoup
  async addRoom(roomInfo) {
    try {
      // posts the data to the alphasoup database
      await Axios.post(`http://localhost:5000/alphaSoup`, { roomCode: roomInfo.roomCode, users: roomInfo.users});
      // by now, all the room info is now transferred to alphaSoup      } catch (error) {
    } catch (error) {
      console.log(error.message);
    }
  }



  // ------------------------------------ Form & Button Handling ------------------------------------

  // this is a testing function, will convert the homelobby data into alphasoup data
  handleSwitchRoom = () => {

    // request the socket's room
    clientSocket.emit("reqSocketRoom");

    // requests player information to be retrieved
    clientSocket.emit("reqUpdateWords");
    
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



  // ------------------------------------ Render ------------------------------------


  render() {
    return (
      <div>
        <h3>For testing- this button switches room from homelobby to alphasoup</h3>
        <button onClick={this.handleSwitchRoom}>
          Switch to alphasoup room
        </button>



        <h2>These are the words each player has:</h2>
        
        <PlayerData
          playerData={this.state.playerData}
        />




        <SubmitWord 
          letters={this.state.letters}
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
