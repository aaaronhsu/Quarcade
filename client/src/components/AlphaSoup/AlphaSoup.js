import React, { Component } from 'react';
import clientSocket from '../../ClientSocket.js';

class AlphaSoup extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      ready: false,
      tileCount : 0,
    }
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

  submitWord = () => {
    clientSocket.emit("reqPointValue", "dog");
  };

  createWordButton = () => {
    return (
      <button onClick={() => this.submitWord()}>
        click to submit word
      </button>
    );
  }

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

        {this.createWordButton()}
      </div>
    );
  }
}

export default AlphaSoup;
