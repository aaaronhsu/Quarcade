# Quarcade

<img alt="Home Screen" src="https://github.com/aaaronhsu/Quarcade/blob/main/home_screen.png">

## Description
Quarcade is a game platform where people can generate and join private rooms to play AlphaSoup, a competitive word-building game created for fun group play online. This project was created in collaboration with the Google Mentorship Program at Stuyvesant High School. 

## Usage for Local Deployment
0. Ensure that you have Node.js and npm installed
1. Clone the repository
2. Navigate to `Quarcade/client/` and install packages with `npm install` or `pip install -r requirements.txt`
3. To start the client, run `npm start`
4. Navigate to `Quarcade/server/` and install packages with `npm install` or `pip install -r requirements.txt`
5. To start the server, run `node index.js`
6. Quarcade should now be running on port 3000!


## Rules and Gameplay
To play AlphaSoup, players must create words from a shared pool of letters. Forming words will add the word to a player's bank, which will earn the player points. It will also remove the used letters from the shared pool. The player with the most points at the end of the game wins!

Players can steal words (and their point values) from other players by creating a new word that uses all the letters in the stolen word and at least one additional letter from the pool (e.g `CAN` can be stolen to make the word `CHANGE` if the letters `H`, `G`, and `E` exist in the pool). Players may steal multiple words at a time (e.g. `SET` and `LET` can be stolen to produce the word `LETTERS` if the letter `r` exists in the pool).

If an unrecognized word is submitted, it will be placed into a player's bank, but it will not earn points. Other players can vote to validate the word for points. Each player can have at most one invalid word in their list at a time.

Letters are added to the pool when the majority of players agree to add a letter to the pool. The game ends when the pool is empty and all players have agreed to end the game.


<img alt="Game Screen" src="https://github.com/aaaronhsu/Quarcade/blob/main/game_screen.png">

## Technologies Used
- React
- Node.js
- Express
- Socket.io
- MongoDB
- Mongoose
- Figma

## Contributors
- Aaron Hsu
- Eliza Knapp

## Credits
Thank you to [Alex Feng](https://www.linkedin.com/in/alexfengfeng/) and Rachel Chen for their mentorship and guidance throughout the project!