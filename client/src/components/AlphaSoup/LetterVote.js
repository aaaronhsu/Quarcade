import React, { Component } from "react";
import clientSocket from '../../ClientSocket.js';
import Axios from "axios";

class LetterVote extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      votesForNextLetter: 0,
      votedForNextLetter: false,
    }
  }



  // ------------------------------------ Socket.io ------------------------------------

  componentDidMount() {
    // updates the number of users that have voted for a new letter
    clientSocket.on("recUpdateNextLetterVote", () => {
      this.changeVote(0);
    });

    // resets the vote for the next letter
    clientSocket.on("recResetVotesForNextLetter", () => {
      this.setState({
        votedForNextLetter: false,
        votesForNextLetter: 0
      });
    });
  }

  componentWillUnmount() {
    clientSocket.off("recUpdateNextLetterVote");
    clientSocket.off("recResetVotesForNextLetter");
  }



  // ------------------------------------ Axios ------------------------------------

  // retrieves roomCode through db through socketID
  async getRoomCode(socketID, vote) {
    try {
      await Axios.get(`http://localhost:5000/user/bySocket/${socketID}`).then(
        res => {
          // up to here, success! gets the roomcode
          const roomCode = res.data[0].roomCode;

          // now must use roomcode info to get the alphasoup
          this.updateVotesInRoom(roomCode, vote);

          
        }
      )
    } catch (error) {
      console.log("problem getting room by socket");
    }
  }

  // retrieves and edits the number of votes in a room
  async updateVotesInRoom(roomCode, vote) {
    try {
      await Axios.get(`http://localhost:5000/alphaSoup/${roomCode}`).then(
        res => {
          // already have roomCode
          const votes = res.data[0].votes;

          // all players will have voted
          if (votes + vote == this.props.numPlayers) {

            // GAME END HERE!!!!!!!!!!!!!!!!
            // THE GAME ENDS HERE
            // THIS IS VERY IMPORTANT
            // SO IT REQUIRES A LOT OF COMMENTS
            if (this.props.lettersLeft === 0) {
              // end the game

              // show final scores
              // delete all user data
              // remove alphasoup room
              // return all users to lobby screen
            }

            // reset the vote count in the database
            this.patchVotes(roomCode, 0);
            
            // requests new letter
            clientSocket.emit("reqNewLetter");
            
            // requests all users to reset their vote states
            clientSocket.emit("reqResetVotesForNextLetter");
            
            
            this.props.updateLettersLeft(1); // reduces the number of letters left in the database
          }
          else {
            this.setState({
              votesForNextLetter: votes + vote
            });
  
            // uses that room code to patch the new current votes value to database
            this.patchVotes(roomCode, votes + vote);
  
            // requests all users to update the number of votes
            if (vote != 0) clientSocket.emit("reqUpdateNextLetterVote");
          }

        }
      )

    } catch (error) {
      console.log("problem getting the correct alphasoup");
    }
  }


  async patchVotes(roomCode, votes) {
    try {
      await Axios.patch(`http://localhost:5000/alphaSoup/${roomCode}`, {votes: votes}).then(
        // for some reason, patch doesn't actually return the new data fast enough... 
      )
    } catch (error) {
      console.log(error.message);
    }
  }



  // ------------------------------------ Form & Button Handling ------------------------------------

  // ensures that players can't vote twice (enables the toggle)
  changeVoteStatus = (voted) => {
    this.setState({
      votedForNextLetter: voted
    });
  }

  // handles voting for next letter
  handleVoteSubmission = () => {
    if (this.state.votedForNextLetter) {
      // removes vote
      this.changeVote(-1);

      this.setState({
        votedForNextLetter: false
      });
    }
    else {
      // adds vote
      this.changeVote(1);

      this.setState({
        votedForNextLetter: true
      });
    }
  }



  // ------------------------------------ Utility ------------------------------------

  // changes vote in database (if parameter is 1 then +1, if -1 then -1 to the vote count)
  changeVote = (vote) => {
    // gets roomcode based on id (users collection)
    this.getRoomCode(clientSocket.id, vote);
  }



  // ------------------------------------ Render ------------------------------------

  // renders button for voting for next letter
  renderButtonVoteNextLetter = () => {
    return (
      <div>
        {
          this.props.voted ?

          <button onClick={() => this.handleVoteSubmission()}>
            Press this to remove your vote for the next letter
          </button>
          :
          <button onClick={() => this.handleVoteSubmission()}>
            Press this to add your vote for the next letter
          </button>
        }
      </div>
    );
  }


  render() {
    return (
      <div>

        <h3>{this.state.votesForNextLetter} out of {this.props.numPlayers} have voted</h3>
        {this.renderButtonVoteNextLetter()}

      </div>
    );
  }
}

export default LetterVote;