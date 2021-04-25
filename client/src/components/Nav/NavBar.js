import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { useLocation } from 'react-router-dom';

class NavBar extends React.Component {
  render() {
    return (
      <div>
        <ul>
          <li>
            <Link to="/">
              Quarcade
            </Link>
          </li>
          {this.props.location.pathname != "/" ?
            null:
            <li>
              <Link to="/about">
                About
              </Link>
            </li>}
        </ul>
      </div>
    );
  }
}

export default NavBar;
