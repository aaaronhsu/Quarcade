import React, { Component } from "react";
import clientSocket from '../../ClientSocket.js';
import Axios from "axios";

import './LetterVote.css';

class LetterVote extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      votesForNextLetter: 0,
      votedForNextLetter: false,

      voteOnCooldown: false,
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

          this.setState({
            voteOnCooldown: false
          });

          // all players will have voted
          if (votes + vote == this.props.numPlayers) {
            
            // reset the vote count in the database
            this.patchVotes(roomCode, 0);

            // GAME END HERE!!!!!!!!!!!!!!!!
            // THE GAME ENDS HERE
            // THIS IS VERY IMPORTANT
            // SO IT REQUIRES A LOT OF COMMENTS
            if (this.props.lettersLeft <= 0) {
              clientSocket.emit("reqAlphaSoupEnd"); // show final scores
              
              return;
            }
            
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

    if (this.state.voteOnCooldown) return;

    
    this.setState({
      voteOnCooldown: true
    });

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
      <div class="lettervote-buttondiv">
        {
          this.state.votedForNextLetter ?

          (
            this.props.lettersLeft !== 0 ? 
            (
              <button class="lettervote-letterremove lettervote-button" onClick={() => this.handleVoteSubmission()}>
                Remove vote for next letter
              </button>
            )
            :
            (
              <button class="lettervote-endremove lettervote-button" onClick={() => this.handleVoteSubmission()}>
                Remove vote to end game
              </button>
            )

          )
          :
          (
            this.props.lettersLeft !== 0 ? 
            (
              <button class="lettervote-letteradd lettervote-button" onClick={() => this.handleVoteSubmission()}>
                Add vote for next letter
              </button>
            )
            :
            (
              <button class="lettervote-endadd lettervote-button" onClick={() => this.handleVoteSubmission()}>
                Add vote to end game
              </button>
            )

          )

        }
      </div>
    );
  }


  render() {
    return (
      <div class="lettervote">

        {this.renderButtonVoteNextLetter()}
        {
          this.props.lettersLeft === 0 ?
          <h3 class="lettervote-info"><span class="yellow lettervote-votesleft">{this.state.votesForNextLetter}/{this.props.numPlayers}</span> players are ready to end the game!</h3>
          :
          <h3 class="lettervote-info"><span class="yellow lettervote-votesleft">{this.state.votesForNextLetter}/{this.props.numPlayers}</span> players are ready for the next letter!</h3>
        }

      </div>
    );
  }
}

export default LetterVote;