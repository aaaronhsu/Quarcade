import React, { Component } from 'react';

import socket from '../../ClientSocket.js';

class Players extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      room: "unassigned",
      players: [],
      changeName: false,
      nameVisible: true,
      name: "Player 1",
    };
  }

  componentDidMount() {
    socket.on("recPlayersInRoom", (players) => {
      this.setState({players: players});
    });

    socket.on("recSocketRoom", (room) => {
      this.setState({room: room});
    })
  }

  // handles swap from visible name to name form
  handleClick = event => {
    this.setState({
      changeName: !this.state.changeName,
      nameVisible: false
    });
    event.preventDefault();
  }

  // handles changes to text field for name form
  handleChange = event => {
    this.setState({
      name: event.target.value
    });
  }

  // changes visible name on submission of name form
  handleSubmit = event => {
      event.preventDefault();
      this.setState({
        name: this.state.name,
        changeName: !this.state.changeName,
        nameVisible: true
      });
  }

  render() {
    return (
      <div>
        <h1>List of Players in {this.state.room}:</h1>

        {
          this.state.players.map(player => (
            this.state.nameVisible ? (
            <h2 onClick={this.handleClick} key={player}>{player}</h2>
            ) : null ),
          )
        }
        {this.state.changeName ? (
              <form onSubmit={this.handleSubmit}>
                <label>
                  <input name="name" type="text" value={this.state.name} onChange={this.handleChange} />
                </label>
              </form>
            ) : null
        }
      </div>
    )}
}

export default Players;
