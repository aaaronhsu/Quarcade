import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import './NavBar.css';
import Chicken from './Chicken.png';

class NavBar extends React.Component {
  render() {
    return (
      <div>
        <ul>
          <li class="homelink">
            <Link to="/"><img src={Chicken}/></Link>
          </li>
          <li>
            <Link to="/lobby">Lobby</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/chat">Chat</Link>
          </li>
          <li>
            <Link to="/alphasoup">AlphaSoup</Link>
          </li>
        </ul>
      </div>
    );
  }
}

export default NavBar;
