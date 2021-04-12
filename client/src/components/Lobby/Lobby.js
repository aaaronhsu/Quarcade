import React, { Component } from 'react';
import ChooseGame from './ChooseGame.js'
import Players from './Players.js';
import ReadyButton from './ReadyButton.js';
import Chat from '../Chat/Chat.js';

class Lobby extends React.Component {
  render() {
    return (
      <div>
        <ChooseGame />
        <Players />
        <Chat />
      </div>
    )}
}

export default Lobby;
