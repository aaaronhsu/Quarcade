import React, { Component } from "react";
import Axios from "axios";
import clientSocket from "../../ClientSocket.js";
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";

class JoinRoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      code: "",
      redirectToLobby: false,
    };
  }

  // handles changes to text field for room code
  handleChange = event => {
    const change = event.target.value;
    const name = event.target.name;

    this.setState({
      [name]: change
    });
  };

  // submits room code to database
  handleSubmit = event => {
    event.preventDefault();

    // need to connect with backend database and implement verification
    let tempName = "temporary name that will be updated in lobby";
    this.checkExistenceAndJoin(this.state.code, tempName);

    //clears the fields, this is just to make it look better
    this.setState({ code: "" });
  };

  // get request to see if it exists, if it doesn't, call post
  async checkExistenceAndJoin(roomCode, tempName) {
    try {
      await Axios.get(`http://localhost:5000/homeLobby/${roomCode}`).then(
        res => {
          const matches = res.data;

          // this means if it exists you can join
          if (matches.length > 0) {
            console.log("User has been added to room", roomCode);

            // adds user to the room in the database
            Axios.put(`http://localhost:5000/homeLobby/${roomCode}`, { users: { name: tempName, socket: clientSocket.id } });

            // adds user to socket room
            clientSocket.emit("moveRoom", roomCode);

            // handles update of the players in the room
            clientSocket.emit("reqPlayersInRoom");
            clientSocket.emit("reqSocketRoom");


            // redirects user to lobby
            this.setState({
              redirectToLobby : true
            });

          } else {
            alert("This room does not exist");
          }
        },
        error => {
          console.log(error);
        }
      );
    } catch (error) {
      console.log("There was an error with get Room");
    }
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>
            Room Code:
            <input name="code" type="text" value={this.state.code} onChange={this.handleChange} />
          </label>
        </form>
        {this.state.redirectToLobby ? (<Redirect to="/lobby" />) : null}
      </div>
    );
  }
}

export default JoinRoom;
