import React, { Component } from 'react';
import clientSocket from '../../ClientSocket.js';
import Axios from "axios";

class SubmitWord extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      word: "",

      wordsBeingStolen: [],
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

    let lettersLeftAfterWordSubmission = this.checkValidWord(this.state.word);

    // lettersLeftAfterWordSubmission will be [-1] if there the word is not valid
    if (!(lettersLeftAfterWordSubmission.length === 1 & lettersLeftAfterWordSubmission[0] === -1)) {

      // request the letters left to be updated in state (removes letters from the state of all players)
      clientSocket.emit("reqUpdateLetters", lettersLeftAfterWordSubmission);

      this.removeWords();

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
  removeWords = () => {
    for (let i = 0; i < this.state.wordsBeingStolen.length; i++) {
      console.log("the word", this.state.wordsBeingStolen[i], "will be removed from the db");
    }
  }

  // helper function for checkValidWord to check if the letter exists in the list of words
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

          wordsBeingStolen.push(this.props.playerData[i].wordsOwned[j].word);

          for (let k = 0; k < this.props.playerData[i].wordsOwned[j].word.length; k++) {
            letters.push(this.props.playerData[i].wordsOwned[j].word.charAt(k));
          }
        }
      }
    }

    this.setState({
      wordsBeingStolen: wordsBeingStolen
    });

    return letters;
  }

  // this only checks if the word is able to be made with the letters currently in the list
  checkValidWord = word => {
    // words with less than 3 letters are not allowed
    if (word.length < 3) return [-1];

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
      if (lettersFromWord.length === 1 && lettersFromWord[0] === -1) return [-1];
    }

    for (var i = 0; i < lettersFromWord.length; i++) {

      lettersFromPool = this.removeFirst(lettersFromPool, lettersFromWord[i]);

      if (lettersFromPool.length === 1 && lettersFromPool[0] === -1) return [-1];
    }

    return lettersFromPool;
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