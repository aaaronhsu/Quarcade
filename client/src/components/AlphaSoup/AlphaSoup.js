import React, { Component } from 'react';
import clientSocket from '../../ClientSocket.js';
import Axios from "axios";

import SubmitWord from './SubmitWord.js';
import Letters from './Letters.js';

class AlphaSoup extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      letters: [],

      playerData: [],
    }
  }

  componentDidMount() {
    console.log("component mounted")

    // records the room the socket is in
    clientSocket.on("recSocketRoom", (room) => {
      console.log("received room");
      // console.log(room);
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
              username: retrievedPlayerData[i].socket,
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

  // adds a letter to the list of letters
  addLetter = (letter) => {
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
      console.log("removing", word.charAt(i));
      newLetters = this.removeFirst(newLetters, word.charAt(i));
    }

    this.setState({
      letters: newLetters
    });
  };

  // this is a testing function, will convert the homelobby data into alphasoup data
  handleSwitch = () => {
    // alert("button")
    console.log("button clicked");

    // request the socket's room
    clientSocket.emit("reqSocketRoom");
    
  }

  // takes the room from socket and requests the data
  async makeSwitch(room) {
    console.log("made it to makeSwitch " + room);
    try {
      await Axios.get(`http://localhost:5000/homeLobby/${room}`).then(
        res => {
          const roomInfo = res.data[0];
          // logs the info of the room
          console.log(roomInfo);
          // here we do axios.post roomInfo to the room 
          this.addRoom(roomInfo);
        }
      )
    } catch (error) {
      console.log("Could not get that room");
    }
  }
  async addRoom(roomInfo) {
    console.log("ran add room");
    console.log(roomInfo.roomCode);
    try {
      // posts the data to the alphasoup database
      await Axios.post(`http://localhost:5000/alphaSoup`, { roomCode: roomInfo.roomCode, users: roomInfo.users});
      // by now, all the room info is now transferred to alphaSoup      } catch (error) {
    } catch (error) {
      console.log(error.message);
    }
  }

  // renders the words that each player has, as well as the points
  renderPlayerData = () => {
    return (
      <div>
        {
          this.state.playerData.map(player => (
            <div>
            <h3>{player.username} ({player.points}):</h3>

            <ul>
            {
              player.wordsOwned.map(word => (
                <li>{word.word} ({word.points})</li>
              ))
            }
            </ul>
            </div>
          ))
        }
      </div>
      
    );
  }

  render() {
    return (
      <div>
        <h3>For testing- this button switches room from homelobby to alphasoup</h3>
        <button onClick={this.handleSwitch}>
          Switch to alphasoup room
        </button>



        <h2>These are the words each player has:</h2>
        {this.renderPlayerData()}




        <SubmitWord 
          letters={this.state.letters}
          removeLetters={(word) => this.removeLetters(word)}
        />

        <Letters 
          letters={this.state.letters} 
          addLetter={(letter) => this.addLetter(letter)} 
        />
      </div>
    );
  }
}

export default AlphaSoup;
