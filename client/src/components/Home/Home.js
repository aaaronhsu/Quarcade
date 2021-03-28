import React, { Component } from 'react';
import JoinRoom from './JoinRoom.js';
import CreateRoom from './CreateRoom.js';
import socket from '../../ClientSocket.js';
import './Home.css';

class Home extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <h1>Quarcade</h1>
        <JoinRoom />
        <CreateRoom />
      </div>
    )}
}

export default Home;
