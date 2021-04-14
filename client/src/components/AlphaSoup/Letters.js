import React, { Component } from 'react';
import clientSocket from '../../ClientSocket.js';

class Letters extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      numLettersDEBUG: 0,
    };
  }



  // ------------------------------------ Socket.io ------------------------------------

  componentDidMount() {

    // takes a new letter and adds it to the list of letters
    clientSocket.on("recNewLetter", letter => {
      this.props.addLetter(letter);
    });
  
  }

  componentWillUnmount() {
    clientSocket.off("recNewLetter");
  }

  // requests new letter
  requestNewLetter = () => {
    clientSocket.emit("reqNewLetter");
  }

  

  // ------------------------------------ Form & Button Handling ------------------------------------

  // FOR DEBUG, generates N letters
  createNLetters = (event) => {
    event.preventDefault();

    for (var i = 0; i < this.state.numLettersDEBUG; i++) {
      this.requestNewLetter();
    }

    this.setState({
      numLettersDEBUG: 0
    });
  }

  // FOR DEBUG, sets the number of letters made
  changeNLetters = (event) => {
    event.preventDefault();

    this.setState({
      numLettersDEBUG: event.target.value
    });
  }



  // ------------------------------------ Utility ------------------------------------

  // handles voting for next letter
  handleVoteSubmission = () => {
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
  


  // ------------------------------------ Render ------------------------------------

  // renders text that shows how many letters there are
  renderNumberOfLetters = () => {
    return (
      <h3>
        Here is the letter count: {this.props.numLetters}
      </h3>
    )
  }

  // renders button for voting for next letter
  renderButtonVoteNextLetter = () => {
    return (
      <div>
        {
          this.props.voted ?

          <button onClick={() => this.handleVoteSubmission()}>
            Press this to remove your vote for the next letter
          </button>
          :
          <button onClick={() => this.handleVoteSubmission()}>
            Press this to add your vote for the next letter
          </button>
        }
      </div>
    );
  }

  // FOR DEBUG, renders the button to change the number of letters rendered
  renderButtonAddNLetters = () => {
    return (
      <div>
        <form onSubmit={this.createNLetters}>
          <label>
            Enter number of letters to create (DEBUG ONLY): 
            <input name="numLettersDEBUG" type="text" value={this.state.numLettersDEBUG} onChange={this.changeNLetters} />
          </label>
        </form>
      </div>
    )
  }

  

  render() {
    return (
      <div>
        {this.renderNumberOfLetters()} <br></br>

        Number of votes: {this.props.votes}/{this.props.playerData.length}

        {this.renderButtonVoteNextLetter()} {this.renderButtonAddNLetters()} <br></br>
        Current Letters:
        <ul>
        {
          this.props.letters.map(letter => (
            <li key={letter.id}>{letter}</li>
          ))
        } 
        </ul>
        
      </div>
    );
  }


}

export default Letters;