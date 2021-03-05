import React, { Component } from 'react';
import { subscribeToTimer, reset } from './api.js';

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

  resetVal = () => {
    this.setState({val: reset()});
  }

  resetButton = () => {
    return (
      <div>
        <button onClick={() => this.resetVal()}> 
          <h1>Click this to reset</h1>
        </button>
      </div>
    );
  }

  render() {
    return (
      <div>
        <h1>This is the timer value: {this.state.val}</h1>
        {this.resetButton()}
      </div>
    );
  }
}

export default App;