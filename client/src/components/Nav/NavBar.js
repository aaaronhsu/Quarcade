import React, { Component } from "react";
import { HashRouter as Router, Switch, Route, Link } from "react-router-dom";
import { useLocation } from 'react-router-dom';

import './NavBar.css';
import '../Global.css';

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
          {window.location.pathname != "/" ?
            null:
            <li>
              <Link className="floatRight" to="/about">
                About
              </Link>
            </li>}
        </ul>
      </div>
    );
  }
}

export default NavBar;
