import React, { Component } from 'react';
import clientSocket from '../../ClientSocket.js';

class SubmitWord extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      word: "",
    }
  }

  componentDidMount() {
    clientSocket.on("recRemoveWord", (word) => {
      this.props.removeLetters(word);
    })
  }

  // helper function for checkValidWord to check if the letter exists in the list of words
  removeFirst = (src, element) => {
    const index = src.indexOf(element);
    if (index === -1) return [-1];
    return [...src.slice(0, index), ...src.slice(index + 1)];
  }

  // this only checks if the word is able to be made with the letters currently in the list
  checkValidWord = word => {
    let newLetters = [...this.props.letters];

    for (var i = 0; i < word.length; i++) {
      newLetters = this.removeFirst(newLetters, word.charAt(i));

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
      clientSocket.emit("reqPointValue", this.state.word);
      clientSocket.emit("reqRemoveWord", this.state.word);
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