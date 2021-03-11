import React, { Component } from 'react';
import JoinRoom from './JoinRoom.js'
import CreateRoom from './CreateRoom.js'

class Home extends React.Component {
  render() {
    return (
      <div>
        <JoinRoom />
        <CreateRoom />
      </div>
    )}
}

export default Home;
