import React, { Component } from 'react';

import './Rules.css';

class Rules extends React.Component {
  render() {
    return (
      <div class="rules">
        <h2>Welcome to AlphaSoup!</h2>

        <ul>
          <li class="rules-rule">The object of the game is to <span class="rules-bold">score the most points by <span class="yellow">forming words</span></span> with the letters above</li>
          <li class="rules-rule">Valid words can be <span class="rules-steal">stolen</span>. You may steal words by clicking a player's word and forming a new, longer word that contains all the letters in the stolen word. You may steal multiple words at a time.</li>
          <li class="rules-rule"><span class="rules-invalid">Invalid</span> words do not count towards a player's points, but may be <span class="rules-validate">validated</span> when all players have voted to validate it. A player can only hold 1 invalid word at a time.</li>
          <li class="rules-rule">Once the letter pool is depleted, players can vote to end the game. <span class="rules-bold">The player with the most points wins!</span></li>
        </ul>
      </div>
    );
  }
}

export default Rules;