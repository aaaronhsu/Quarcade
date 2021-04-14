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

  // ------------------------------------ Socket.io ------------------------------------

  componentDidMount() {
    // receives word submission after calculating points
    clientSocket.on("recSubmitWord", ({ word: word, points: points }) => {
      // add word to database
      this.addWord(word, points);
    })
  }

  componentWillUnmount() {
    clientSocket.off("recSubmitWord");
  }



  // ------------------------------------ Axios Requests ------------------------------------

  // adds word to the list of words for the user
  async addWord(word, points) {
    try {
      await Axios.put(`http://localhost:5000/user/${clientSocket.id}`, { wordsOwned: {word: word, points: points}});
    }
    catch (error) {
      console.log("word was not submitted properly");
    }

    // requests all users to pull the added word to the database
    clientSocket.emit("reqUpdateWords");
  }



  // ------------------------------------ Form & Button Handling ------------------------------------

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
      // if the word is valid (the letters are there)...

      // request the word to be created (removes letters from the state of all players)
      clientSocket.emit("reqCreateWord", this.state.word);

      // submit the word to the database and request all users to update states
      clientSocket.emit("reqSubmitWord", this.state.word);

    }
    else {
      console.log(`you cannot make the word "${this.state.word}" with the current letters`);
    }

    this.setState({
      word: "",
    });
  };



  // ------------------------------------ Utility ------------------------------------

  // helper function for checkValidWord to check if the letter exists in the list of words
  removeFirst = (src, element) => {
    try {
      src.remove(element);
    }
    catch (err) {
      return [-1];
    }

    return src;
  }

  fetchLettersFromStolenWords = () => {
    let letters = [];

    // loop through all of the players
    for (let i = 0; i < this.props.playerData.length; i++) {

      // loop through the player's words
      for (let j = 0; j < this.props.playerData[i].wordsOwned.length; j++) {

        // check if the word is being stolen
        if (this.props.playerData[i].wordsOwned[j].beingStolen) {
          // add the word's letters to the list of letters

          for (let k = 0; k < this.props.playerData[i].wordsOwned[j].word.length; k++) {
            letters.push(this.props.playerData[i].wordsOwned[j].word.charAt(k));
          }
        }
      }
    }

    return letters;
  }

  // this only checks if the word is able to be made with the letters currently in the list
  checkValidWord = word => {
    // words with less than 3 letters are not allowed
    if (word.length < 3) return false;

    let lettersFromWord = [];

    for (let i = 0; i < word.length; i++) {
      lettersFromWord.push(word.charAt(i));
    }

    // available letters from stolen words
    let lettersFromStolenWords = this.fetchLettersFromStolenWords();
    
    // available letters from community
    let lettersFromPool = [...this.props.letters];

    // loop through the letters in the stolen words and remove them from the list of letters from the word being made
    for (var i = 0; i < lettersFromStolenWords.length; i++) {
      lettersFromWord = this.removeFirst(lettersFromWord, lettersFromStolenWords[i]);

      // if the letter doesn't exist in the word you are trying to make, then you can't make the word
      if (lettersFromWord === [-1]) return false;
    }

    for (var i = 0; i < lettersFromWord.length; i++) {

      lettersFromPool = this.removeFirst(lettersFromPool, lettersFromWord[i]);

      if (lettersFromPool == [-1]) return false;
    }


    return true;
  };



  // ------------------------------------ Render ------------------------------------
  
  // form to submit a word
  renderWordSubmission = () => {
    return (
      <form onSubmit={this.submitWord}>
          <label>
            Enter a word to submit:
            <input name="word" type="text" value={this.state.word} onChange={this.handleWordChange} />
          </label>
      </form>
    );
  }

  render() {
    return (
      <div>
        {this.renderWordSubmission()}
      </div>
    );
  }
}

export default SubmitWord;