import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import ChooseGame from './components/Lobby/ChooseGame.js';
import RoomCode from './components/Home/RoomCode.js';
import NavBar from './components/Nav/NavBar.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
      isToggleOn: true,
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
        <br />
        <Router>
          <Switch>
            <NavBar/>
          </Switch>
          <Switch>
            <Route path="/" exact component={RoomCode}/>
            <Route path="/lobby" component={ChooseGame}/>
            <Route path="/about" component={About}/>
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
