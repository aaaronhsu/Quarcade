import React, { Component } from "react";

import clientSocket from "../../ClientSocket.js";

class NameSwitch extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // should the name be in form mode to switch it 
      switchMode: false
    };
  }

  componentDidMount() {
    
  }

  componentWillUnmount() {
    
  }

  handleSwitchName = () => {
    //it will change the state so the form will render
    this.setState({
      switchMode: true
    });

  }

  //for each player, 
  
  render() {
    return (
      <div>
        {this.state.switchMode ? (
          <form>
            <input name="newName" type="text"/>
          </form>
        ) : 
          <h1 onClick={this.handleSwitchName} key={this.props.key}>
            {this.props.player} 
          </h1>
        }
      </div>
    );
  }
}

export default NameSwitch;
