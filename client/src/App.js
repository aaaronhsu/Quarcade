import React from 'react';
import './App.css';
import Foo from './Button'
import NameForm from './Form'

class Full extends React.Component {
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
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
        <button onClick={() => this.handleClick()}>
          Toggle State {this.state.isToggleOn ? 'ON' : 'OFF'}
        </button>
        {<Foo />}
        {<NameForm />}
      </div>
    );
  }
}

export default Full;
