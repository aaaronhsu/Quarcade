import React, { Component } from "react";

import clientSocket from "../../ClientSocket.js";

class NameSwitch extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    
  }

  componentWillUnmount() {
    
  }

  handleSwitchName = () => {
    alert("clicked name");
    //make it so a form appears in place
  }

  //for each player, 
  
  render() {
    return (
      <div>
        <h1 key={this.props.key}>Player: {this.props.player} </h1>
        
      </div>
    );
  }
}

export default NameSwitch;
