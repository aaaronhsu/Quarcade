import React, { Component } from 'react';
import JoinRoom from './JoinRoom.js';
import CreateRoom from './CreateRoom.js';
import clientSocket from '../../ClientSocket.js';

class Home extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <JoinRoom />
        <CreateRoom />
      </div>
    )}
}

export default Home;
