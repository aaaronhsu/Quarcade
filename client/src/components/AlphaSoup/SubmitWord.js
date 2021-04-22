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


    // dataReturned[0] is the rest of the letters, it is [-1] if the letter can't be made
    // dataReturned[1] is the list of words that are stolen
    let dataReturned = this.checkValidWord(this.state.word);

    // lettersLeftAfterWordSubmission will be [-1] if there the word is not valid
    if (!(dataReturned[0].length === 1 & dataReturned[0][0] === -1)) {

      // request the letters left to be updated in state (removes letters from the state of all players)
      clientSocket.emit("reqUpdateLetters", dataReturned[0]);

      this.removeWords(dataReturned[1]);

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

  // TODO request axios to remove words from state of players
  removeWords = (wordsBeingStolen) => {
    for (let i = 0; i < wordsBeingStolen.length; i++) {

      this.removeWord(wordsBeingStolen[i]);
    }

    clientSocket.emit("reqUpdateWords");
  }

  async removeWord(word) {
    console.log(word);
    try {
      await Axios.put(`http://localhost:5000/user/removeWord/${word[0]}`, {word: word[1]});
    } catch (error) {
      console.log(error.message);
    }
  }

  // helper function for checkValidWord to remove element from src, returns [-1] if it's not possible
  removeFirst = (src, element) => {
    try {

      let indexRemoval = -1;
      
      for (let i = 0; i < src.length; i++) {
        if (src[i] === element) {
          indexRemoval = i;
          break;
        }
      }

      if (indexRemoval === -1) return [-1];

      src.splice(indexRemoval, 1);
    }
    catch (err) {
      return [-1];
    }

    return src;
  }

  fetchLettersFromStolenWords = () => {
    let letters = [];

    let wordsBeingStolen = [];

    // loop through all of the players
    for (let i = 0; i < this.props.playerData.length; i++) {

      // loop through the player's words
      for (let j = 0; j < this.props.playerData[i].wordsOwned.length; j++) {

        // check if the word is being stolen
        if (this.props.playerData[i].wordsOwned[j].beingStolen) {
          // add the word's letters to the list of letters

          wordsBeingStolen.push([this.props.playerData[i].username, this.props.playerData[i].wordsOwned[j].word]);

          for (let k = 0; k < this.props.playerData[i].wordsOwned[j].word.length; k++) {
            letters.push(this.props.playerData[i].wordsOwned[j].word.charAt(k));
          }
        }
      }
    }

    return [letters, wordsBeingStolen];
  }

  // this only checks if the word is able to be made with the letters currently in the list
  checkValidWord = word => {

    // words with less than 3 letters are not allowed
    if (word.length < 3) {
      return [[-1], []];
    }

    let lettersFromWord = [];

    for (let i = 0; i < word.length; i++) {
      lettersFromWord.push(word.charAt(i));
    }

    // available letters from stolen words
    let lettersFromStolenWords = this.fetchLettersFromStolenWords();

    // you cannot make a new word using only the letters from a single stolen word
    if (lettersFromStolenWords[1].length === 1 && (lettersFromStolenWords[0].length === word.length)) {
      return [[-1], []];
    }
    
    // available letters from community
    let lettersFromPool = [...this.props.letters];

    // loop through the letters in the stolen words and remove them from the list of letters from the word being made
    for (var i = 0; i < lettersFromStolenWords[0].length; i++) {
      lettersFromWord = this.removeFirst(lettersFromWord, lettersFromStolenWords[0][i]);

      // if the letter doesn't exist in the word you are trying to make, then you can't make the word
      if (lettersFromWord.length === 1 && lettersFromWord[0] === -1) return [[-1], []];
    }

    for (var i = 0; i < lettersFromWord.length; i++) {

      lettersFromPool = this.removeFirst(lettersFromPool, lettersFromWord[i]);

      // there are not enough letters to make this word
      if (lettersFromPool.length === 1 && lettersFromPool[0] === -1) {
        return [[-1], []];
      }
    }

    return [lettersFromPool, lettersFromStolenWords[1]];
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