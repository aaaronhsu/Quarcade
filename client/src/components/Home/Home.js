import React, { Component } from 'react';
import JoinRoom from './JoinRoom.js';
import CreateRoom from './CreateRoom.js';
import clientSocket from '../../ClientSocket.js';

import './Home.css';

class Home extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>

        <h1 class="home-header">Quarcade</h1>

        <hr class="divider"></hr>

        <div>
          <JoinRoom />
          <CreateRoom />
        </div>
        
      </div>
    )}
}

export default Home;
