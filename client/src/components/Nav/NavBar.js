import React, { Component } from "react";
import { HashRouter as Router, Switch, Route, Link } from "react-router-dom";
import { useLocation } from 'react-router-dom';

import './NavBar.css';
import '../Global.css';

class NavBar extends React.Component {
  render() {
    return (
      <div>
        <ul class="nav-ul">
          <li class="nav-li">
            <Link class="nav-li" to="/">
              Quarcade
            </Link>
          </li>
          {window.location.pathname != "/" ?
            null:
            <li class="nav-li">
              <Link class="floatRight nav-li" to="/about">
                About
              </Link>
            </li>}
        </ul>
      </div>
    );
  }
}

export default NavBar;
