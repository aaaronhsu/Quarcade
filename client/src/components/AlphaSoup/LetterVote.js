import React, { Component } from "react";

class LetterVote extends React.Component {

  constructor(props) {
    super(props);
  }

  // handles voting for next letter
  handleVoteSubmission = () => {
    if (this.props.voted) {
      // removes vote
      this.props.changeVote(-1);

      this.props.changeVoteStatus(false);
    }
    else {
      // adds vote
      this.props.changeVote(1);

      this.props.changeVoteStatus(true);
    }
  }

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

        <h3>{this.props.votesForNextLetter ? 1 : 0} out of {this.props.numPlayers} have voted</h3>
        {this.renderButtonVoteNextLetter()}
      </div>
    );
  }
}

export default LetterVote;