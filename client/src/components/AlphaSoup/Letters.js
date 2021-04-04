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

    // if the number of letters sent in is less than 10
    if (this.props.numLetters < 10) {
      // request a new letter
      this.requestNewLetter();
    }
  
  }

  // requests new letter
  requestNewLetter = () => {
    clientSocket.emit("reqNewLetter");
  }

  addVote = () => {
    // add 1 to the counter
    //this.props.addOneVote();
    // somehow stop you from adding another vote
    // should make the button disappear - ask how
  } 

  // requests new letter
  createNextLetterButton = () => {
    return (
      <button onClick={() => this.props.addOneVote()}>
        Press this to vote to get another letter;
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