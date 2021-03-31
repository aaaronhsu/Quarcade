import React, { Component } from 'react';
import clientSocket from '../../ClientSocket.js';

import SubmitWord from './SubmitWord.js';
import Letters from './Letters.js';

class AlphaSoup extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      ready: false,
      tileCount : 0,

      letters: [],
    }
  }

  componentDidMount() {
    // retrieves the point value of the word that was submitted
    clientSocket.on("recPointValue", (val) => {
      console.log("point value: " + val);
    });
  }

  // handles clicking the ready for next tile button
  handleClick = event => {
    this.setState({
      ready: !this.state.ready
    });
    console.log('Player ready for next tile');

    // .put click to backend to update number of users who have readied up
    // need to connect with backend database and reveal next tile once everyone readies up
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

  render() {
    return (
      <div>
        <h2>Tiles left: {this.state.tileCount}</h2>
        {this.state.ready ? null :
          <button onClick={this.handleClick}>
            <label>
              Ready for next tile?
            </label>
          </button>}

        <SubmitWord letters={this.state.letters} removeLetters={(word) => this.removeLetters(word)} />

        <Letters letters={this.state.letters} addLetter={(letter) => this.addLetter(letter)} />
      </div>
    );
  }
}

export default AlphaSoup;
