import React, { Component } from 'react';
import clientSocket from '../../ClientSocket.js';

class Letters extends React.Component {

  constructor(props) {
    this.state = {
      letters: [],
    };
  }

  componentDidMount() {

    // takes a new letter and adds it to the list of letters
    clientSocket.on("recNewLetter", letter => {
      let newLetters = [...this.state.letters];
      newLetters.push(letter);

      this.setState({
        letters: newLetters
      });
    });
  }

  


}

export default Letters;