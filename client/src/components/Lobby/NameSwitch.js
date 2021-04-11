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
    // TODO: add to database

    this.addName()

    // TODO: emit message to be caught in other file to pull all info for rendering
  }

  async addName() {
    try {
      await Axios.patch(`http://localhost:5000/user/name/${clientSocket.id}`, 
      {name: this.state.currentName}).then(
        //this works, the name is added to the databse
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
