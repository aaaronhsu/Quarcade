import React, { Component } from "react";
import Axios from 'axios';
import clientSocket from "../../ClientSocket.js";

class NameSwitch extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // should the name be in form mode to switch it 
      switchMode: false,
      currentName: this.props.player,
    };
  }

  componentDidMount() {

  }

  componentWillUnmount() {
    
  }

  handleSwitchName = () => {
    /*
    CODE BELOW: VERY IMPORTANT- used to check if you can change

    // first check if you are allowed to switch the name (is it you)
    // TO DO: this currently is a problem because you can only switch name once
    if (this.state.currentName === clientSocket.id) {
      // it will change the state so the form will render
      this.setState({
        switchMode: true
      });
    } else {
      alert("you may only change your name");
    }
    */

    // for now using this code, allows anyone to switch any name
    this.setState({
      switchMode: true
    });

  }

  handleChange = (event) => {
    this.setState({
      currentName: event.target.value
    });
  }

  handleSubmit = (event) => {
    event.preventDefault();    
    // set switch mode to false again
    this.setState({
      switchMode: false
    });
    console.log("submitted");

    // adds to the database, for later games
    this.addName()

    // ERROR: something here isn't working
    // I think it's that the changeUsername in the backend
    // doesn't actually work

    // causes the backend to change client.username
    clientSocket.emit("changeUsername", this.state.currentName);
    // now that the username is changed, emit the request to repull users
    // this is caught in players.js and updates its state
    clientSocket.emit("reqUsersInRoom");
  }

  async addName() {
    try {
      await Axios.patch(`http://localhost:5000/user/name/${clientSocket.id}`, 
      {name: this.state.currentName}).then(
        console.log("added new name")
        // this works, the name is added to the databse
        // nothing needs to be done, it's just so that you have a name in the game
      )
    } catch (error) {
      console.log("problem updating the name")
    }
  }

  
  render() {
    return (
      <div>
        {this.state.switchMode ? (
          <form onSubmit={this.handleSubmit}>
            <label>Edit: </label>
            <input name="newName" type="text" value={this.state.currentName} onChange={this.handleChange}/>
          </form>
        ) : 
          <h1 onClick={this.handleSwitchName} key={this.props.key}>
            {this.state.currentName} 
          </h1>
        }
      </div>
    );
  }
}

export default NameSwitch;
