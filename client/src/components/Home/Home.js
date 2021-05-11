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

        <table class="home-body">
          <tr>
            <td class="home-content">
              <h1 class="home-header">Quarcade</h1>
            </td>

            <td class="home-content">
              <JoinRoom />
              <CreateRoom />
            </td>
          </tr>
        </table>
      </div>
    )}
}

export default Home;
