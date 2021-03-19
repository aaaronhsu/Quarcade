import React, { Component } from 'react';

class ReadyButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ready: false,
    }
  }

  // handles clicking the ready button
  handleClick = event => {
    if (!this.props.votedGame) {
      return
    }
    this.setState({
      ready: !this.state.ready
    });
    console.log(this.state.ready)

    // .put submission to backend to update number of users who have readied up
    // need to connect with backend database and route user to the actual game once everyone readies up
  }

  // get information from backend about how many people have readied up
  // update the number as people ready up
  render() {
    return (
      <div>
        <button onClick={this.handleClick}>
          <label>
            {this.state.ready ? 'Unready?' : 'Ready?'}
          </label>
        </button>
      </div>
    );
  }
}

export default ReadyButton;
