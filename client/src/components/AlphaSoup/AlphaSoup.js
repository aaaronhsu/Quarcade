import React, { Component } from 'react';
import clientSocket from '../../ClientSocket.js';

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
    // retrieves the point value of the word that was submitted
    clientSocket.on("recPointValue", ({word, pts}) => {
      let newWords = [...this.state.words];

      newWords.push(word);

      this.setState({
        words: newWords,
        points: this.state.points + pts,
      });
    });
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
