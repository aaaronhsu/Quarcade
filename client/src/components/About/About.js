import React, { Component } from 'react';
import './About.css';

class About extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <h1 class="about-header">About Quarcade</h1>

        <p class="about-text">Quarcade is a game platform where people can generate and join private rooms to play AlphaSoup, a competitive word-building game created for fun group play online. This project was created in collaboration with the Google Mentorship Program at Stuyvesant High School. </p>

        <p class="about-text">Quarcade currently has one game, AlphaSoup, but more games are being developed.</p>
      </div>
    )
  }
}

export default About;
