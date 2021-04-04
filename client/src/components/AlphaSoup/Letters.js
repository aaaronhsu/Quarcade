import React, { Component } from 'react';
import clientSocket from '../../ClientSocket.js';

class Letters extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {

    // takes a new letter and adds it to the list of letters
    clientSocket.on("recNewLetter", letter => {
      this.props.addLetter(letter);
    });

    if (this.props.numLetters < 10) {
      this.requestNewLetter();
    }
  }

  // requests new letter
  requestNewLetter = () => {
    clientSocket.emit("reqNewLetter");
  }

  // requests new letter
  createNextLetterButton = () => {
    return (
      <button onClick={() => this.requestNewLetter()}>
        Press this to get a new letter!
      </button>
    );
  }

  testerPassing = () => {
    return (
      <h3>
        Here is the letter count: {this.props.numLetters}
      </h3>
    )
  }

  render() {
    return (
      <div>
        {this.testerPassing()} <br></br>
        {this.createNextLetterButton()} <br></br>
        Current Letters:
        <ul>
        {
          this.props.letters.map(letter => (
            <li>{letter}</li>
          ))
        } 
        </ul>
        
      </div>
    );
  }


}

export default Letters;