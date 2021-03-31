import React, { Component } from 'react';
import clientSocket from '../../ClientSocket.js';

class AlphaSoup extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      ready: false,
      tileCount : 0,

      word: "",
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

    this.setState({
      word: "",
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

        <form onSubmit={this.submitWord}>
          <label>
            Enter a word to submit:
            <input name="word" type="text" value={this.state.word} onChange={this.handleWordChange} />
          </label>
        </form>
      </div>
    );
  }
}

export default AlphaSoup;
