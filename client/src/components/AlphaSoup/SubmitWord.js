import React, { Component } from 'react';
import clientSocket from '../../ClientSocket.js';
import Axios from "axios";

class SubmitWord extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      word: "",
    }
  }

  componentDidMount() {
    // receives word submission after calculating points
    clientSocket.on("recSubmitWord", ({ word: word, points: points }) => {

      // removes letters from list of letters
      this.props.removeLetters(word);

      this.addWord(word, points);
    })
  }

  // adds word to the list of words for the user
  async addWord(word, points) {
    try {
      await
      Axios.put(`http://localhost:5000/user/${clientSocket.id}`, { wordsOwned: {word: word, points: points}});
    }
    catch (error) {
      console.log("word was not submitted properly");
    }
  }

  // helper function for checkValidWord to check if the letter exists in the list of words
  removeFirst = (src, element) => {
    const index = src.indexOf(element);
    if (index === -1) return [-1];
    return [...src.slice(0, index), ...src.slice(index + 1)];
  }

  // this only checks if the word is able to be made with the letters currently in the list
  checkValidWord = word => {

    // words with less than 3 letters are not allowed
    if (word.length < 3) return false;

    // available letters
    let newLetters = [...this.props.letters];

    // loop through the letters in the word and remove them from the list of available letters
    for (var i = 0; i < word.length; i++) {
      newLetters = this.removeFirst(newLetters, word.charAt(i));

      // if the letter doesn't exist, then you can't make the word
      if (newLetters[0] == [-1]) return false;
    }

    return true;
  };

  // handles the change of the word being submitted
  handleWordChange = event => {
    event.preventDefault();

    this.setState({
      word: event.target.value,
    });
  }

  // submits word to clientSocket to determine its point value
  submitWord = event => {
    event.preventDefault();

    if (this.checkValidWord(this.state.word)) {
      // if the word is able to be made with the given letters, then retrieve the point value and remove the word from the list
      clientSocket.emit("reqRemoveWord", this.state.word);
      clientSocket.emit("reqSubmitWord", this.state.word);

      // then add it to the list for that user
      // some kind of put request here, but it requires the socketID
      
    }
    else {
      console.log("you cannot make the word", "\"" + this.state.word + "\"", "with the current letters");
    }

    this.setState({
      word: "",
    });
  };

  render() {
    return (
      <form onSubmit={this.submitWord}>
          <label>
            Enter a word to submit:
            <input name="word" type="text" value={this.state.word} onChange={this.handleWordChange} />
          </label>
      </form>
    );
  }
}

export default SubmitWord;