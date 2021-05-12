import React, { Component } from "react";
import Axios from 'axios';
import clientSocket from "../../ClientSocket.js";

import './NameSwitch.css';

class NameSwitch extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // should the name be in form mode to switch it 
      switchMode: false,
      currentName: this.props.player[0],
      currentID: this.props.player[1],
      displayName: this.props.player[0]
    };
  }

  componentDidMount() {
    if (this.state.currentID === clientSocket.id) {
      const toDisplay = this.state.displayName + " (me)";
      this.setState({displayName: toDisplay});
    }
  }

  componentWillUnmount() {
    
  }

  // ------------------------------------ Axios Requests ------------------------------------

  // changes name in database
  async addName() {
    try {
      await Axios.patch(`http://localhost:5000/user/name/${clientSocket.id}`, 
      {name: this.state.currentName}).then(
        // console.log("added new name")
      )
    } catch (error) {
      console.log("problem updating the name")
    }
  }



  // ------------------------------------ Form & Button Handling ------------------------------------

  handleChangeName = (event) => {
    event.preventDefault();

    this.setState({
      currentName: event.target.value
    });
  }

  handleSubmitNameChange = (event) => {
    event.preventDefault();    

    // unrenders the name changing form
    this.setState({
      switchMode: false
    });

    // adds to the database, for later games
    this.addName();

    if (this.state.currentName.length > 15) return;

    // causes the backend to change client.username
    clientSocket.emit("changeUsername", this.state.currentName);
    // now that the username is changed, emit the request to repull users
    // this is caught in players.js and updates its state
    clientSocket.emit("reqUsersInRoom");
  }


  // ------------------------------------ Utility ------------------------------------

  handleSwitchName = () => {
    // first check if you are allowed to switch the name (is it you)
    if (this.state.currentID === clientSocket.id) {
      // it will change the state so the form will render
      this.setState({
        switchMode: true
      });
    } else {
      alert("you may only change your name");
    }
  }



  // ------------------------------------ Render ------------------------------------

  render() {
    return (
      <div>
        {
          this.state.switchMode ? (
            <form onSubmit={this.handleSubmitNameChange}>
              <input class="nameswitch-input" placeholder="Enter a New Name" name="newName" type="text" value={this.state.currentName} onChange={this.handleChangeName}/>
            </form>
          ) : 
          <span class="nameswitch-display" onClick={this.handleSwitchName} key={this.props.key}>
              {this.state.displayName}
          </span>
        }
      </div>
    );
  }
}

export default NameSwitch;
