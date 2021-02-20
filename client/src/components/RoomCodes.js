import React, { Component } from "react";

class RoomCodes extends Component {
  constructor(props) {
    super(props);

    this.state = {
      rooms: [],
      RoomCodeHolder: ""
    };
  }

  handleCodeInput = e => {
    let stateClone = { ...this.state };
    stateClone.RoomCodeHolder = e.target.value;
    this.setState(stateClone);
  };

  handleCreateRoom = e => {
    e.preventDefault();
    let roomsCopy = [...this.state.rooms];
    let newRoom = {
      RoomCode: this.state.RoomCodeHolder,
      active: true
    };
    if (roomsCopy.length > 0) {
      newRoom["id"] = roomsCopy[roomsCopy.length - 1].id + 1;
    } else {
      newRoom["id"] = 1;
    }
    roomsCopy.push(newRoom);
    this.setState({
      rooms: roomsCopy
    });
    //Axios.push(newRoom);
  };

  render() {
    return (
      <>
        <div>
          <form onSubmit={this.handleCreateRoom}>
            <label>
              <small>Create Room </small>
            </label>
            <input onChange={this.handleCodeInput} name="Create Room" />
            <button type="submit">Create</button>
          </form>
        </div>
      </>
    );
  }
}

export default RoomCodes;
