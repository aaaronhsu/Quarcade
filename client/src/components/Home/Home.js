import React, { Component } from 'react';
import RoomCode from './RoomCode.js'
import CreateRoom from './CreateRoom.js'

class Home extends React.Component {
  render() {
    return (
      <div>
        <RoomCode />
        <CreateRoom />
      </div>
    )}
}

export default Home;
