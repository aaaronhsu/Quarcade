import React, { Component } from 'react';

class ChooseGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ''
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    // need to connect with backend database
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Please choose a game:
          <select value={this.state.value} onChange={this.handleChange}>
            <option value='bananagrams'>Bananagrams</option>
            <option value='codenames'>CodeNames</option>
          </select>
        </label>
        <input type='submit' value='Submit' />
      </form>
    );
  }
}

export default ChooseGame;
