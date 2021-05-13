import React, { Component } from 'react';
import clientSocket from '../../ClientSocket.js';

import './Letters.css';

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
      this.props.updateLettersLeft(this.state.numLettersDEBUG);
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



  // ------------------------------------ Render ------------------------------------

  // renders text that shows how many letters there are
  renderNumberOfLetters = () => {
    return (
      <h3>
        Here is the letter count: {this.props.numLetters}
      </h3>
    )
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


        {this.renderButtonAddNLetters()} <br></br>
        Current Letters:
        <div class="letters-display">
        {
          this.props.letters.map(letter => (
            <span class="letters-tile" key={letter.id}>{letter}</span>
          ))
        } 
        </div>
        
      </div>
    );
  }


}

export default Letters;