import React, { Component } from 'react';
import ReadyButton from './ReadyButton.js';

class ChooseGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedGame: '',
      votedGame: false,
    }
  }


  
  // ------------------------------------ Form & Button Handling ------------------------------------

  // handles changes in game selection
  handleChangeGameChoice = event => {
    this.setState({
      selectedGame: event.target.selectedGame,
      votedGame: false,
    });
  }

  // handles submission of game selection
  // TODO right now, if you submit the form for the same game twice, you can't ready up
  handleSubmitGameChoice = event => {
    event.preventDefault();
    this.setState({
      votedGame: !this.state.votedGame,
    });
  }



  // ------------------------------------ Render ------------------------------------

  // need to connect game selection with backend database
  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmitGameChoice}>
          <label>
            Please choose a game:
            <select value={this.state.selectedGame} onChange={this.handleChangeGameChoice}>
              <option value='alphasoup'>AlphaSoup</option>
              <option value='codenames'>CodeNames</option>
            </select>
          </label>
          <input type='submit' value='Submit' />
        </form>
        <ReadyButton
          key={this.state.votedGame}
          votedGame={this.state.votedGame}
        />
      </div>
    );
  }
}

export default ChooseGame;
