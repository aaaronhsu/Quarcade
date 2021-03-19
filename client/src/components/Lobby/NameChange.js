import React, { Component } from 'react';

class NameChange extends Component{
    constructor(props) {
        super(props);
        this.state = {
          name: "Player 1",
          changeName: false,
          nameVisible: true,
        };
    }

    // handles swap from visible name to name form
    handleClick = event => {
        this.setState({
          changeName: !this.state.changeName,
          nameVisible: false
        });
        event.preventDefault();
    }

    // handles changes to text field for name form
    handleChange = event => {
        this.setState({
          name: event.target.value
        });
    }

    // changes visible name on submission of name form
    handleSubmit = event => {
        event.preventDefault();
        this.setState({
          name: this.state.name,
          changeName: !this.state.changeName,
          nameVisible: true
        });
    }

    render() {
        return (
          <div>
            <br/>
            {this.state.nameVisible ? (
                <h2 onClick={this.handleClick}>{this.state.name}</h2>
            ) : null}

            {this.state.changeName ? (
              <form onSubmit={this.handleSubmit}>
                <label>
                  <input name="name" type="text" value={this.state.name} onChange={this.handleChange} />
                </label>
              </form>
            ) : null}
          </div>
        );
      }
}

export default NameChange;
