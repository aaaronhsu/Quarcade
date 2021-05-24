import React, { Component } from "react";
import { HashRouter as Router, Switch, Route, Link } from "react-router-dom";

import Lobby from "./components/Lobby/Lobby.js";
import Home from "./components/Home/Home.js";
import NavBar from "./components/Nav/NavBar.js";
import About from "./components/About/About.js";
import Chat from "./components/Chat/Chat.js";
import AlphaSoup from "./components/AlphaSoup/AlphaSoup.js";

import clientSocket from './ClientSocket.js';

class App extends React.Component {

  render() {
    return (
      <div>
        <Router>
          <Switch>
            <NavBar />
          </Switch>
          <Switch>
            <Route path="/" exact component={Home} />
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
