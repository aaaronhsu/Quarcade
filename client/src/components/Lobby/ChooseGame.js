import React, { Component } from 'react';
import ReadyButton from './ReadyButton.js';

class ChooseGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      votedGame: false,
    }
  }

  // handles changes in game selection
  handleChange = event => {
    this.setState({
      value: event.target.value,
      votedGame: false,
    });
  }

  // handles submission of game selection
  // TODO right now, if you submit the form for the same game twice, you can't ready up
  handleSubmit = event => {
    console.log(this.state.votedGame)
    this.setState({
      votedGame: !this.state.votedGame,
    });
    event.preventDefault();
  }

  // need to connect game selection with backend database
  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>
            Please choose a game:
            <select value={this.state.value} onChange={this.handleChange}>
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
