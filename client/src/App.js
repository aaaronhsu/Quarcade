import React, { Component } from 'react';
import RoomCode from './RoomCode.js'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
      isToggleOn: true
    };
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({
      date: new Date()
    });
  }

  handleClick() {
    this.setState(state => ({
      isToggleOn: !state.isToggleOn
    }));
  }

  render() {
    return (
      <div>
        <h1>Quarcade</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
        <button onClick={() => this.handleClick()}>
          Log {this.state.isToggleOn ? 'On' : 'Out'}
        </button>
        {<RoomCode />}
      </div>
    );
  }
}

export default App;
