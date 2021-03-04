import React, { Component } from 'react';
import { subscribeToTimer } from './api.js';

class App extends Component {

  constructor(props) {
    super(props);

    subscribeToTimer((err, val) => this.setState({
      val
    }));

    this.state = {
      val: 'no val yet',
    };
  }

  render() {
    return (
      <div>
        <h1>This is the timer value: {this.state.val}</h1>
      </div>
    );
  }
}

export default App;