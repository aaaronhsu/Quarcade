import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import Lobby from "./components/Lobby/Lobby.js";
import Home from "./components/Home/Home.js";
import NavBar from "./components/Nav/NavBar.js";
import About from "./components/About/About.js";
import Chat from "./components/Chat/Chat.js";
import AlphaSoup from "./components/AlphaSoup/AlphaSoup.js";

import clientSocket from './ClientSocket.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
      isToggleOn: true
    };
  }

  componentDidMount() {
    this.timerID = setInterval(() => this.tick(), 1000);
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
        {/* <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
        <button onClick={() => this.handleClick()}>Log {this.state.isToggleOn ? "On" : "Out"}</button> */}
        {/* <br /> */}
        <Router>
          <Switch>
            <NavBar />
          </Switch>
          <Switch>
            <Route path="/" exact component={Home}/>
            <Route path="/lobby" component={Lobby} />
            <Route path="/about" component={About} />
            <Route path="/chat" component={Chat} />
            <Route path="/alphasoup" component={AlphaSoup} />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
