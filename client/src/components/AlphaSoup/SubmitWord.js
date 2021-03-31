import React, { Component } from 'react';
import clientSocket from '../../ClientSocket.js';

class SubmitWord extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      word: "",
    }
  }

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
    // TODO: check if the word is able to be created from given letters

    clientSocket.emit("reqPointValue", this.state.word);

    this.props.removeLetters(this.state.word);

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