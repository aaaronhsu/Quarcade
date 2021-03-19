import React, { Component } from 'react';
import ChooseGame from './ChooseGame.js'
import Players from './Players.js';
import ReadyButton from './ReadyButton.js';

class Lobby extends React.Component {
  render() {
    return (
      <div>
        <ChooseGame />
        <Players />
      </div>
    )}
}

export default Lobby;
