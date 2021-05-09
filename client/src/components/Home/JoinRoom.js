import React, { Component } from "react";
import Axios from "axios";
import clientSocket from "../../ClientSocket.js";
import { HashRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";

import './JoinRoom.css';

class JoinRoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      roomCode: "",
      redirectToLobby: false,

      username: this.nameGeneration()
    };

    clientSocket.emit("changeUsername", this.state.username);
  }
  


  // ------------------------------------ Axios Requests ------------------------------------

  // joins room if it exists
  async joinRoom(roomCode) {
    try {

      // checks if room exists
      await Axios.get(`http://localhost:5000/homeLobby/${roomCode}`).then(
        res => {
          const matches = res.data;

          // joins the room if it exists
          if (matches.length > 0) {

            // number of players in the room
            const userNum = res.data[0].users.length;

            if (userNum < 6) {
              // adds user to the room in the database
              Axios.put(`http://localhost:5000/homeLobby/${roomCode}`, { users: {socket: clientSocket.id, name: this.state.username } });

              // add user to the user collection
              Axios.post("http://localhost:5000/user", {roomCode: roomCode, name: this.state.username, socket: clientSocket.id});

              // adds user to socket room
              clientSocket.emit("moveRoom", roomCode);

              // handles update of the players in the room
              clientSocket.emit("reqUsersInRoom");
              clientSocket.emit("reqSocketRoom");

              // redirects user to lobby
              this.setState({
                redirectToLobby : true
              });
            } else {
              alert("there are already 6 players in this room");
            }
          } else {
            alert("This room does not exist");
          }
        },
        error => {
          console.log(error);
        }
      );
    } catch (error) {
      console.log("There was an error with Axios getRoom");
    }
  }



  // ------------------------------------ Form & Button Handling ------------------------------------

  // handles changes to text field for room code
  handleChangeJoinRoom = event => {
    this.setState({
      roomCode: event.target.value
    });
  };

  // submits room code to database
  handleSubmitJoinRoom = event => {
    event.preventDefault();

    // need to connect with backend database and implement verification
    this.joinRoom(this.state.roomCode);

    //clears the fields, this is just to make it look better
    this.setState({ roomCode: "" });
  };



  // ------------------------------------ Render ------------------------------------
  
  render() {
    return (
      <div>
        <h2 class="header-text">
          Have a Room Code?
        </h2>
        <form class="submit-room" onSubmit={this.handleSubmitJoinRoom}>
          <input placeholder="Enter a Room Code..." name="roomCode" type="text" value={this.state.roomCode} onChange={this.handleChangeJoinRoom} />
        </form>
        {this.state.redirectToLobby ? (<Redirect to="/lobby" />) : null}
      </div>
    );
  }
















  nameGeneration = () => {
    const names = [
      "Anonymous Aardvark", 
      "Anonymous Abyssinian", 
      "Anonymous Affenpinscher", 
      "Anonymous Akbash", 
      "Anonymous Akita", 
      "Anonymous Albatross", 
      "Anonymous Alligator", 
      "Anonymous Angelfish", 
      "Anonymous Ant", 
      "Anonymous Anteater", 
      "Anonymous Antelope", 
      "Anonymous Armadillo", 
      "Anonymous Avocet", 
      "Anonymous Axolotl", 
      "Anonymous Baboon", 
      "Anonymous Badger", 
      "Anonymous Balinese", 
      "Anonymous Bandicoot", 
      "Anonymous Barb", 
      "Anonymous Barnacle", 
      "Anonymous Barracuda", 
      "Anonymous Bat", 
      "Anonymous Beagle", 
      "Anonymous Bear", 
      "Anonymous Beaver", 
      "Anonymous Beetle", 
      "Anonymous Binturong", 
      "Anonymous Bird", 
      "Anonymous Birman", 
      "Anonymous Bison", 
      "Anonymous Bloodhound", 
      "Anonymous Bobcat", 
      "Anonymous Bombay", 
      "Anonymous Bongo", 
      "Anonymous Bonobo", 
      "Anonymous Booby", 
      "Anonymous Budgerigar", 
      "Anonymous Buffalo", 
      "Anonymous Bulldog", 
      "Anonymous Bullfrog", 
      "Anonymous Burmese", 
      "Anonymous Butterfly", 
      "Anonymous Caiman", 
      "Anonymous Camel", 
      "Anonymous Capybara", 
      "Anonymous Caracal", 
      "Anonymous Cassowary", 
      "Anonymous Cat", 
      "Anonymous Caterpillar", 
      "Anonymous Catfish", 
      "Anonymous Centipede", 
      "Anonymous Chameleon", 
      "Anonymous Chamois", 
      "Anonymous Cheetah", 
      "Anonymous Chicken", 
      "Anonymous Chihuahua", 
      "Anonymous Chimpanzee", 
      "Anonymous Chinchilla", 
      "Anonymous Chinook", 
      "Anonymous Chipmunk", 
      "Anonymous Cichlid", 
      "Anonymous Coati", 
      "Anonymous Cockroach", 
      "Anonymous Collie", 
      "Anonymous Coral", 
      "Anonymous Cougar", 
      "Anonymous Cow", 
      "Anonymous Coyote", 
      "Anonymous Crab", 
      "Anonymous Crane", 
      "Anonymous Crocodile", 
      "Anonymous Cuscus", 
      "Anonymous Cuttlefish", 
      "Anonymous Dachshund", 
      "Anonymous Dalmatian", 
      "Anonymous Deer", 
      "Anonymous Dhole", 
      "Anonymous Dingo", 
      "Anonymous Discus", 
      "Anonymous Dodo", 
      "Anonymous Dog", 
      "Anonymous Dolphin", 
      "Anonymous Donkey", 
      "Anonymous Dormouse", 
      "Anonymous Dragonfly", 
      "Anonymous Drever", 
      "Anonymous Duck", 
      "Anonymous Dugong", 
      "Anonymous Dunker", 
      "Anonymous Eagle", 
      "Anonymous Earwig", 
      "Anonymous Echidna", 
      "Anonymous Elephant", 
      "Anonymous Emu", 
      "Anonymous Falcon", 
      "Anonymous Ferret", 
      "Anonymous Fish", 
      "Anonymous Flamingo", 
      "Anonymous Flounder", 
      "Anonymous Fly", 
      "Anonymous Fossa", 
      "Anonymous Fox", 
      "Anonymous Frigatebird", 
      "Anonymous Frog", 
      "Anonymous Gar", 
      "Anonymous Gecko", 
      "Anonymous Gerbil", 
      "Anonymous Gharial", 
      "Anonymous Gibbon", 
      "Anonymous Giraffe", 
      "Anonymous Goat", 
      "Anonymous Goose", 
      "Anonymous Gopher", 
      "Anonymous Gorilla", 
      "Anonymous Grasshopper", 
      "Anonymous Greyhound", 
      "Anonymous Grouse", 
      "Anonymous Guppy", 
      "Anonymous Hamster", 
      "Anonymous Hare", 
      "Anonymous Harrier", 
      "Anonymous Havanese", 
      "Anonymous Hedgehog", 
      "Anonymous Heron", 
      "Anonymous Himalayan", 
      "Anonymous Hippopotamus", 
      "Anonymous Horse", 
      "Anonymous Human", 
      "Anonymous Hummingbird", 
      "Anonymous Hyena", 
      "Anonymous Ibis", 
      "Anonymous Iguana", 
      "Anonymous Impala", 
      "Anonymous Indri", 
      "Anonymous Insect", 
      "Anonymous Jackal", 
      "Anonymous Jaguar", 
      "Anonymous Javanese", 
      "Anonymous Jellyfish", 
      "Anonymous Kakapo", 
      "Anonymous Kangaroo", 
      "Anonymous Kingfisher", 
      "Anonymous Kiwi", 
      "Anonymous Koala", 
      "Anonymous Kudu", 
      "Anonymous Labradoodle", 
      "Anonymous Ladybird", 
      "Anonymous Lemming", 
      "Anonymous Lemur", 
      "Anonymous Leopard", 
      "Anonymous Liger", 
      "Anonymous Lion", 
      "Anonymous Lionfish", 
      "Anonymous Lizard", 
      "Anonymous Llama", 
      "Anonymous Lobster", 
      "Anonymous Lynx", 
      "Anonymous ", 
      "Anonymous Macaw", 
      "Anonymous Magpie", 
      "Anonymous Maltese", 
      "Anonymous Manatee", 
      "Anonymous Mandrill", 
      "Anonymous Markhor", 
      "Anonymous Mastiff", 
      "Anonymous Mayfly", 
      "Anonymous Meerkat", 
      "Anonymous Millipede", 
      "Anonymous Mole", 
      "Anonymous Molly", 
      "Anonymous Mongoose", 
      "Anonymous Mongrel", 
      "Anonymous Monkey", 
      "Anonymous Moorhen", 
      "Anonymous Moose", 
      "Anonymous Moth", 
      "Anonymous Mouse", 
      "Anonymous Mule", 
      "Anonymous Neanderthal", 
      "Anonymous Newfoundland", 
      "Anonymous Newt", 
      "Anonymous Nightingale", 
      "Anonymous Numbat", 
      "Anonymous Ocelot", 
      "Anonymous Octopus", 
      "Anonymous Okapi", 
      "Anonymous Olm", 
      "Anonymous Opossum", 
      "Anonymous Orang-utan", 
      "Anonymous Ostrich", 
      "Anonymous Otter", 
      "Anonymous Oyster", 
      "Anonymous Pademelon", 
      "Anonymous Panther", 
      "Anonymous Parrot", 
      "Anonymous Peacock", 
      "Anonymous Pekingese", 
      "Anonymous Pelican", 
      "Anonymous Penguin", 
      "Anonymous Persian", 
      "Anonymous Pheasant", 
      "Anonymous Pig", 
      "Anonymous Pika", 
      "Anonymous Pike", 
      "Anonymous Piranha", 
      "Anonymous Platypus", 
      "Anonymous Pointer", 
      "Anonymous Poodle", 
      "Anonymous Porcupine", 
      "Anonymous Possum", 
      "Anonymous Prawn", 
      "Anonymous Puffin", 
      "Anonymous Pug", 
      "Anonymous Puma", 
      "Anonymous Quail", 
      "Anonymous Quetzal", 
      "Anonymous Quokka", 
      "Anonymous Quoll", 
      "Anonymous Rabbit", 
      "Anonymous Raccoon", 
      "Anonymous Ragdoll", 
      "Anonymous Rat", 
      "Anonymous Rattlesnake", 
      "Anonymous Reindeer", 
      "Anonymous Rhinoceros", 
      "Anonymous Robin", 
      "Anonymous Rottweiler", 
      "Anonymous Salamander", 
      "Anonymous Saola", 
      "Anonymous Scorpion", 
      "Anonymous Seahorse", 
      "Anonymous Seal", 
      "Anonymous Serval", 
      "Anonymous Sheep", 
      "Anonymous Shrimp", 
      "Anonymous Siamese", 
      "Anonymous Siberian", 
      "Anonymous Skunk", 
      "Anonymous Sloth", 
      "Anonymous Snail", 
      "Anonymous Snake", 
      "Anonymous Snowshoe", 
      "Anonymous Somali", 
      "Anonymous Sparrow", 
      "Anonymous Sponge", 
      "Anonymous Squid", 
      "Anonymous Squirrel", 
      "Anonymous Starfish", 
      "Anonymous Stingray", 
      "Anonymous Stoat", 
      "Anonymous Swan", 
      "Anonymous Tang", 
      "Anonymous Tapir", 
      "Anonymous Tarsier", 
      "Anonymous Termite", 
      "Anonymous Tetra", 
      "Anonymous Tiffany", 
      "Anonymous Tiger", 
      "Anonymous Tortoise", 
      "Anonymous Toucan", 
      "Anonymous Tropicbird", 
      "Anonymous Tuatara", 
      "Anonymous Turkey", 
      "Anonymous Uakari", 
      "Anonymous Uguisu", 
      "Anonymous Umbrellabird", 
      "Anonymous Vulture", 
      "Anonymous Wallaby", 
      "Anonymous Walrus", 
      "Anonymous Warthog", 
      "Anonymous Wasp", 
      "Anonymous Weasel", 
      "Anonymous Whippet", 
      "Anonymous Wildebeest", 
      "Anonymous Wolf", 
      "Anonymous Wolverine", 
      "Anonymous Wombat", 
      "Anonymous Woodlouse", 
      "Anonymous Woodpecker", 
      "Anonymous Wrasse", 
      "Anonymous Yak", 
      "Anonymous Zebra", 
      "Anonymous Zebu", 
      "Anonymous Zonkey", 
      "Anonymous Zorse"
    ];

    var name = names[Math.floor(Math.random() * names.length)];

    console.log(name);

    return name;
  }
}

export default JoinRoom;
