import React, { Component, UseState } from "react";

class RoomCodes extends Component {
  constructor(props) {
    super(props);

    this.state = {
      rooms: [],
      RoomCodeHolder: ""
    };
  }

  handleCodeInput = e => {
    let roomHolderClone = { ...this.state.RoomCodeHolder };
    roomHolderClone = e.target.value;
    this.setState({
      RoomCodeHolder: roomHolderClone
    });
  };

  handleCreateRoom = e => {
    e.preventDefault();
    //to add the new room to state
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
    //to clear the input field line
    let roomHolderClone = { ...this.state.RoomCodeHolder };
    roomHolderClone = "";

    //update state
    this.setState({
      rooms: roomsCopy,
      RoomCodeHolder: roomHolderClone
    });

    //Axios.push(newRoom);
  };

  printActivity = active => {
    if (active) return "active";
    else return "inactive";
  };

  render() {
    return (
      <>
        <div>
          <form onSubmit={this.handleCreateRoom}>
            <label>
              <small>Create Room </small>
            </label>
            <input value={this.state.RoomCodeHolder} onChange={this.handleCodeInput} name="Create Room" />
            <button type="submit">Create</button>
          </form>
        </div>
        <div>
          <h3>For Testing Purposes Room Codes added are below</h3>
          {this.state.rooms.map(room => (
            <li>
              {room.RoomCode} is {this.printActivity(room.active)}
            </li>
          ))}
        </div>
      </>
    );
  }
}

export default RoomCodes;
