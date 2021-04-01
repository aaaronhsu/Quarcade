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

      words: [],
      points: 0,
    }
  }

  componentDidMount() {
    console.log("component mounted")
    // retrieves the point value of the word that was submitted
    clientSocket.on("recPointValue", ({word, pts}) => {
      let newWords = [...this.state.words];

      // add the new word to the list of words
      newWords.push(word);

      this.setState({
        words: newWords,
        points: this.state.points + pts,
      });
    });

    // records the room the socket is in
    clientSocket.on("recSocketRoom", (room) => {
      console.log("received room");
      // console.log(room);
      this.makeSwitch(room);
    })
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

    console.log(word);

    for (var i = 0; i < word.length; i++) {
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
      // TODO: make sure it only happens once!!
      await Axios.post(`http://localhost:5000/alphaSoup`, { roomCode: roomInfo.roomCode, users: roomInfo.users});
      // by now, all the room info is now transferred to alphaSoup
    } catch (error) {
      console.log(error.message);
    }
  }

  render() {
    return (
      <div>
        <h3>For testing- this button switches room from homelobby to alphasoup</h3>
        <button onClick={this.handleSwitch}>
          Switch to alphasoup room
        </button>
        <h2>You have {this.state.points} points</h2>
        <h2>These are the words you have:</h2>
        <ul>
          {
            this.state.words.map(word => (
              <li key={word}>{word}</li>
            ))
          } 
        </ul>

        <SubmitWord 
          letters={this.state.letters}
          removeLetters={(word) => this.removeLetters(word)}
          addWord={(word, pts) => this.addWord(word, pts)}
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
