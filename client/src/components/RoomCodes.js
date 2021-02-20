import React, { Component, UseState } from "react";

class RoomCodes extends Component {
  constructor(props) {
    super(props);

    this.state = {
      rooms: [], //the rooms, contains an id, a room code and whether it is active or not
      roomCodeHolder: "" //holder see function right below
    };
  }

  //this sets the roomCodeHolder to the value in the form line
  handleCodeInput = e => {
    let roomHolderClone = { ...this.state.roomCodeHolder };
    roomHolderClone = e.target.value;
    this.setState({
      roomCodeHolder: roomHolderClone
    });
  };

  //when the form is submitted, the new room code is added as an active room
  handleCreateRoom = e => {
    e.preventDefault();

    const roomCode = this.state.roomCodeHolder;
    if (roomCode === "") return;
    
    //to add the new room to state
    let roomsCopy = [...this.state.rooms];

    //updates new room with all info
    let newRoom = {
      roomCode: roomCode,
      active: true
    };

    if (roomsCopy.length > 0) {
      newRoom["id"] = roomsCopy[roomsCopy.length - 1].id + 1;
    } else {
      newRoom["id"] = 1;
    }

    //adds room to state copy
    roomsCopy.push(newRoom);

    //update state
    this.setState({
      rooms: roomsCopy,
      roomCodeHolder: ""
    });

    //for when i do the backend: Axios.push(newRoom);
  };

  //this function is just a helper method to change the boolean in state into words
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
            <input value={this.state.roomCodeHolder} onChange={this.handleCodeInput} name="Create Room" />
            <button type="submit">Create</button>
          </form>
        </div>
        <div>
          <h3>For Testing Purposes Room Codes added are below</h3>
          {this.state.rooms.map(room => (
            <li>
              {room.roomCode} is {this.printActivity(room.active)}
            </li>
          ))}
        </div>
      </>
    );
  }
}

export default RoomCodes;
