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

  // handles vote
  handleVote = () => {
    if (this.props.voted) {
      // removes vote
      this.props.changeVote(-1);

      this.props.changeVoteStatus(false);
    }
    else {
      // adds vote
      this.props.changeVote(1);

      this.props.changeVoteStatus(true);
    }
  }

  // requests new letter
  createNextLetterButton = () => {
    return (
      <button onClick={() => this.handleVote()}>
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

        Number of votes: {this.props.votes}/{this.props.playerData.length}
        
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