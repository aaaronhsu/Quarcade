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
  }

  requestNewLetter = () => {
    clientSocket.emit("reqNewLetter");
  }

  createNextLetterButton = () => {
    return (
      <button onClick={() => this.requestNewLetter()}>
        Press this to get a new letter!
      </button>
    );
  }

  render() {
    return (
      <div>
        {this.createNextLetterButton()}
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