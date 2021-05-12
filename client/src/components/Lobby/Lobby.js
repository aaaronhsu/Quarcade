import React, { Component } from 'react';
import ChooseGame from './ChooseGame.js'
import Players from './Players.js';
import Chat from '../Chat/Chat.js';

import './Lobby.css';

class Lobby extends React.Component {
  render() {
    return (
      <div>

        <div class="lobby-container">
          <div class="lobby-choose">
            <ChooseGame />
          </div>
      

          <div class="lobby-interact">
            <Players />

            <hr class="divider"></hr>

            <Chat />
          </div>
        </div>


      </div>
    )}
}

export default Lobby;
