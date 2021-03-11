import React, { Component } from 'react';

class JoinRoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      code: '',
  };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const change = event.target.value
    const name = event.target.name

    this.setState({
      [name]: change
    });
  }

  handleSubmit(event) {
    alert('Hi ' + this.state.name + ' you submitted Room Code: ' + this.state.code);
    event.preventDefault();

    // need to connect with backend database and implement verification
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <input
            name="name"
            type="text"
            value={this.state.name}
            onChange={this.handleChange} />
        </label>
        <br />
        <label>
          Room Code:
          <input
            name="code"
            type="text"
            value={this.state.code}
            onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

export default JoinRoom;
