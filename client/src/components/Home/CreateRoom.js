import React, { Component, useEffect, useRef, renderComponent } from "react";
import Axios from "axios";
import clientSocket from "../../ClientSocket.js";
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";

class CreateRoom extends React.Component {

  constructor(props) {
    super(props);


    this.state = {
      createRoom: false,
      roomCode: "",
      redirectToLobby : false,

      username: this.nameGeneration()
    };

    // changes the client's username to a random animal
    clientSocket.emit("changeUsername", this.state.username);
  }



  // ------------------------------------ Axios ------------------------------------

  // post request to create new room
  async createRoom(roomCode) {
    try {
      await Axios.post("http://localhost:5000/homeLobby", { roomCode: roomCode, users: {socket: clientSocket.id } }); 

      // adds user to socket room
      clientSocket.emit("moveRoom", (roomCode));

      // handles update of the players in the room
      clientSocket.emit("reqUsersInRoom");
      clientSocket.emit("reqSocketRoom");

      // redirects user to lobby
      this.setState({
        redirectToLobby : true
      });

    } catch (error) {
      console.log("There was an error with post");
    }
  }

  async addUserToRoom(roomCode) {
    try {
      await Axios.post("http://localhost:5000/user", { roomCode: roomCode, name: this.state.username, socket: clientSocket.id});
    } catch (error) {
      console.log("There was an error adding the user to the room homelobbies room");
    }
  }

  // get request to see if the room exists (true if it exists)
  async checkExistence(roomCode) {
    try {
      await Axios.get(`http://localhost:5000/homeLobby/${roomCode}`).then(
        res => {

          const allRooms = res.data;

          if (allRooms.length > 0) {
            alert("This room already exists, please choose another name");
          } else {
            this.createRoom(roomCode);
            this.addUserToRoom(roomCode);
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

  // determines whether or not "create room" is shown
  handleShowCreateRoom = event => {
    this.setState({ createRoom: !this.state.createRoom });
    event.preventDefault();
  };

  // handles changes to text field for room code
  handleChangeCreateRoom = event => {
    this.setState({
      roomCode: event.target.value
    });
  };

  // submits room code to database
  handleSubmitCreateRoom = event => {
    event.preventDefault();

    // checks if the room exists
    this.checkExistence(this.state.roomCode);

    // clears the roomCode field
    this.setState({ roomCode: "" });
  };

  

  // ------------------------------------ Render ------------------------------------

  render() {
    return (
      <div>
        <h2 onClick={this.handleShowCreateRoom}>or, create a room</h2>
        {this.state.createRoom ? (
          <form onSubmit={this.handleSubmitCreateRoom}>
            <label>
              Enter a roomcode to create a room:
              <input name="code" type="text" value={this.state.roomCode} onChange={this.handleChangeCreateRoom} />
            </label>
          </form>
        ) : null}
        {this.state.redirectToLobby ? (<Redirect to="/lobby" />) : null}
      </div>
    );
  }












  nameGeneration = () => {
    const names = [
      "Anonymous Aardvark", 
      "Anonymous Abyssinian", 
      "Anonymous Adelie Penguin", 
      "Anonymous Affenpinscher", 
      "Anonymous Afghan Hound", 
      "Anonymous African Bush Elephant", 
      "Anonymous African Civet", 
      "Anonymous African Clawed Frog", 
      "Anonymous African Forest Elephant", 
      "Anonymous African Palm Civet", 
      "Anonymous African Penguin", 
      "Anonymous African Tree Toad", 
      "Anonymous African Wild Dog", 
      "Anonymous Ainu Dog", 
      "Anonymous Airedale Terrier", 
      "Anonymous Akbash", 
      "Anonymous Akita", 
      "Anonymous Alaskan Malamute", 
      "Anonymous Albatross", 
      "Anonymous Aldabra Giant Tortoise", 
      "Anonymous Alligator", 
      "Anonymous Alpine Dachsbracke", 
      "Anonymous American Bulldog", 
      "Anonymous American Cocker Spaniel", 
      "Anonymous American Coonhound", 
      "Anonymous American Eskimo Dog", 
      "Anonymous American Foxhound", 
      "Anonymous American Pit Bull Terrier", 
      "Anonymous American Staffordshire Terrier", 
      "Anonymous American Water Spaniel", 
      "Anonymous Anatolian Shepherd Dog", 
      "Anonymous Angelfish", 
      "Anonymous Ant", 
      "Anonymous Anteater", 
      "Anonymous Antelope", 
      "Anonymous Appenzeller Dog", 
      "Anonymous Arctic Fox", 
      "Anonymous Arctic Hare", 
      "Anonymous Arctic Wolf", 
      "Anonymous Armadillo", 
      "Anonymous Asian Elephant", 
      "Anonymous Asian Giant Hornet", 
      "Anonymous Asian Palm Civet", 
      "Anonymous Asiatic Black Bear", 
      "Anonymous Australian Cattle Dog", 
      "Anonymous Australian Kelpie Dog", 
      "Anonymous Australian Mist", 
      "Anonymous Australian Shepherd", 
      "Anonymous Australian Terrier", 
      "Anonymous Avocet", 
      "Anonymous Axolotl", 
      "Anonymous Aye Aye", 
      "Anonymous Baboon", 
      "Anonymous Bactrian Camel", 
      "Anonymous Badger", 
      "Anonymous Balinese", 
      "Anonymous Banded Palm Civet", 
      "Anonymous Bandicoot", 
      "Anonymous Barb", 
      "Anonymous Barn Owl", 
      "Anonymous Barnacle", 
      "Anonymous Barracuda", 
      "Anonymous Basenji Dog", 
      "Anonymous Basking Shark", 
      "Anonymous Basset Hound", 
      "Anonymous Bat", 
      "Anonymous Bavarian Mountain Hound", 
      "Anonymous Beagle", 
      "Anonymous Bear", 
      "Anonymous Bearded Collie", 
      "Anonymous Bearded Dragon", 
      "Anonymous Beaver", 
      "Anonymous Bedlington Terrier", 
      "Anonymous Beetle", 
      "Anonymous Bengal Tiger", 
      "Anonymous Bernese Mountain Dog", 
      "Anonymous Bichon Frise", 
      "Anonymous Binturong", 
      "Anonymous Bird", 
      "Anonymous Birds Of Paradise", 
      "Anonymous Birman", 
      "Anonymous Bison", 
      "Anonymous Black Bear", 
      "Anonymous Black Rhinoceros", 
      "Anonymous Black Russian Terrier", 
      "Anonymous Black Widow Spider", 
      "Anonymous Bloodhound", 
      "Anonymous Blue Lacy Dog", 
      "Anonymous Blue Whale", 
      "Anonymous Bluetick Coonhound", 
      "Anonymous Bobcat", 
      "Anonymous Bolognese Dog", 
      "Anonymous Bombay", 
      "Anonymous Bongo", 
      "Anonymous Bonobo", 
      "Anonymous Booby", 
      "Anonymous Border Collie", 
      "Anonymous Border Terrier", 
      "Anonymous Bornean Orang-utan", 
      "Anonymous Borneo Elephant", 
      "Anonymous Boston Terrier", 
      "Anonymous Bottle Nosed Dolphin", 
      "Anonymous Boxer Dog", 
      "Anonymous Boykin Spaniel", 
      "Anonymous Brazilian Terrier", 
      "Anonymous Brown Bear", 
      "Anonymous Budgerigar", 
      "Anonymous Buffalo", 
      "Anonymous Bull Mastiff", 
      "Anonymous Bull Shark", 
      "Anonymous Bull Terrier", 
      "Anonymous Bulldog", 
      "Anonymous Bullfrog", 
      "Anonymous Bumble Bee", 
      "Anonymous Burmese", 
      "Anonymous Burrowing Frog", 
      "Anonymous Butterfly", 
      "Anonymous Butterfly Fish", 
      "Anonymous Caiman", 
      "Anonymous Caiman Lizard", 
      "Anonymous Cairn Terrier", 
      "Anonymous Camel", 
      "Anonymous Canaan Dog", 
      "Anonymous Capybara", 
      "Anonymous Caracal", 
      "Anonymous Carolina Dog", 
      "Anonymous Cassowary", 
      "Anonymous Cat", 
      "Anonymous Caterpillar", 
      "Anonymous Catfish", 
      "Anonymous Cavalier King Charles Spaniel", 
      "Anonymous Centipede", 
      "Anonymous Cesky Fousek", 
      "Anonymous Chameleon", 
      "Anonymous Chamois", 
      "Anonymous Cheetah", 
      "Anonymous Chesapeake Bay Retriever", 
      "Anonymous Chicken", 
      "Anonymous Chihuahua", 
      "Anonymous Chimpanzee", 
      "Anonymous Chinchilla", 
      "Anonymous Chinese Crested Dog", 
      "Anonymous Chinook", 
      "Anonymous Chinstrap Penguin", 
      "Anonymous Chipmunk", 
      "Anonymous Chow Chow", 
      "Anonymous Cichlid", 
      "Anonymous Clouded Leopard", 
      "Anonymous Clown Fish", 
      "Anonymous Clumber Spaniel", 
      "Anonymous Coati", 
      "Anonymous Cockroach", 
      "Anonymous Collared Peccary", 
      "Anonymous Collie", 
      "Anonymous Common Buzzard", 
      "Anonymous Common Frog", 
      "Anonymous Common Loon", 
      "Anonymous Common Toad", 
      "Anonymous Coral", 
      "Anonymous Cottontop Tamarin", 
      "Anonymous Cougar", 
      "Anonymous Cow", 
      "Anonymous Coyote", 
      "Anonymous Crab", 
      "Anonymous Crab-Eating Macaque", 
      "Anonymous Crane", 
      "Anonymous Crested Penguin", 
      "Anonymous Crocodile", 
      "Anonymous Cross River Gorilla", 
      "Anonymous Curly Coated Retriever", 
      "Anonymous Cuscus", 
      "Anonymous Cuttlefish", 
      "Anonymous Dachshund", 
      "Anonymous Dalmatian", 
      "Anonymous Darwin's Frog", 
      "Anonymous Deer", 
      "Anonymous Desert Tortoise", 
      "Anonymous Deutsche Bracke", 
      "Anonymous Dhole", 
      "Anonymous Dingo", 
      "Anonymous Discus", 
      "Anonymous Doberman Pinscher", 
      "Anonymous Dodo", 
      "Anonymous Dog", 
      "Anonymous Dogo Argentino", 
      "Anonymous Dogue De Bordeaux", 
      "Anonymous Dolphin", 
      "Anonymous Donkey", 
      "Anonymous Dormouse", 
      "Anonymous Dragonfly", 
      "Anonymous Drever", 
      "Anonymous Duck", 
      "Anonymous Dugong", 
      "Anonymous Dunker", 
      "Anonymous Dusky Dolphin", 
      "Anonymous Dwarf Crocodile", 
      "Anonymous Eagle", 
      "Anonymous Earwig", 
      "Anonymous Eastern Gorilla", 
      "Anonymous Eastern Lowland Gorilla", 
      "Anonymous Echidna", 
      "Anonymous Edible Frog", 
      "Anonymous Egyptian Mau", 
      "Anonymous Electric Eel", 
      "Anonymous Elephant", 
      "Anonymous Elephant Seal", 
      "Anonymous Elephant Shrew", 
      "Anonymous Emperor Penguin", 
      "Anonymous Emperor Tamarin", 
      "Anonymous Emu", 
      "Anonymous English Cocker Spaniel", 
      "Anonymous English Shepherd", 
      "Anonymous English Springer Spaniel", 
      "Anonymous Entlebucher Mountain Dog", 
      "Anonymous Epagneul Pont Audemer", 
      "Anonymous Eskimo Dog", 
      "Anonymous Estrela Mountain Dog", 
      "Anonymous Falcon", 
      "Anonymous Fennec Fox", 
      "Anonymous Ferret", 
      "Anonymous Field Spaniel", 
      "Anonymous Fin Whale", 
      "Anonymous Finnish Spitz", 
      "Anonymous Fire-Bellied Toad", 
      "Anonymous Fish", 
      "Anonymous Fishing Cat", 
      "Anonymous Flamingo", 
      "Anonymous Flat Coat Retriever", 
      "Anonymous Flounder", 
      "Anonymous Fly", 
      "Anonymous Flying Squirrel", 
      "Anonymous Fossa", 
      "Anonymous Fox", 
      "Anonymous Fox Terrier", 
      "Anonymous French Bulldog", 
      "Anonymous Frigatebird", 
      "Anonymous Frilled Lizard", 
      "Anonymous Frog", 
      "Anonymous Fur Seal", 
      "Anonymous Galapagos Penguin", 
      "Anonymous Galapagos Tortoise", 
      "Anonymous Gar", 
      "Anonymous Gecko", 
      "Anonymous Gentoo Penguin", 
      "Anonymous Geoffroys Tamarin", 
      "Anonymous Gerbil", 
      "Anonymous German Pinscher", 
      "Anonymous German Shepherd", 
      "Anonymous Gharial", 
      "Anonymous Giant African Land Snail", 
      "Anonymous Giant Clam", 
      "Anonymous Giant Panda Bear", 
      "Anonymous Giant Schnauzer", 
      "Anonymous Gibbon", 
      "Anonymous Gila Monster", 
      "Anonymous Giraffe", 
      "Anonymous Glass Lizard", 
      "Anonymous Glow Worm", 
      "Anonymous Goat", 
      "Anonymous Golden Lion Tamarin", 
      "Anonymous Golden Oriole", 
      "Anonymous Golden Retriever", 
      "Anonymous Goose", 
      "Anonymous Gopher", 
      "Anonymous Gorilla", 
      "Anonymous Grasshopper", 
      "Anonymous Great Dane", 
      "Anonymous Great White Shark", 
      "Anonymous Greater Swiss Mountain Dog", 
      "Anonymous Green Bee-Eater", 
      "Anonymous Greenland Dog", 
      "Anonymous Grey Mouse Lemur", 
      "Anonymous Grey Reef Shark", 
      "Anonymous Grey Seal", 
      "Anonymous Greyhound", 
      "Anonymous Grizzly Bear", 
      "Anonymous Grouse", 
      "Anonymous Guinea Fowl", 
      "Anonymous Guinea Pig", 
      "Anonymous Guppy", 
      "Anonymous Hammerhead Shark", 
      "Anonymous Hamster", 
      "Anonymous Hare", 
      "Anonymous Harrier", 
      "Anonymous Havanese", 
      "Anonymous Hedgehog", 
      "Anonymous Hercules Beetle", 
      "Anonymous Hermit Crab", 
      "Anonymous Heron", 
      "Anonymous Highland Cattle", 
      "Anonymous Himalayan", 
      "Anonymous Hippopotamus", 
      "Anonymous Honey Bee", 
      "Anonymous Horn Shark", 
      "Anonymous Horned Frog", 
      "Anonymous Horse", 
      "Anonymous Horseshoe Crab", 
      "Anonymous Howler Monkey", 
      "Anonymous Human", 
      "Anonymous Humboldt Penguin", 
      "Anonymous Hummingbird", 
      "Anonymous Humpback Whale", 
      "Anonymous Hyena", 
      "Anonymous Ibis", 
      "Anonymous Ibizan Hound", 
      "Anonymous Iguana", 
      "Anonymous Impala", 
      "Anonymous Indian Elephant", 
      "Anonymous Indian Palm Squirrel", 
      "Anonymous Indian Rhinoceros", 
      "Anonymous Indian Star Tortoise", 
      "Anonymous Indochinese Tiger", 
      "Anonymous Indri", 
      "Anonymous Insect", 
      "Anonymous Irish Setter", 
      "Anonymous Irish WolfHound", 
      "Anonymous Jack Russel", 
      "Anonymous Jackal", 
      "Anonymous Jaguar", 
      "Anonymous Japanese Chin", 
      "Anonymous Japanese Macaque", 
      "Anonymous Javan Rhinoceros", 
      "Anonymous Javanese", 
      "Anonymous Jellyfish", 
      "Anonymous Kakapo", 
      "Anonymous Kangaroo", 
      "Anonymous Keel Billed Toucan", 
      "Anonymous Killer Whale", 
      "Anonymous King Crab", 
      "Anonymous King Penguin", 
      "Anonymous Kingfisher", 
      "Anonymous Kiwi", 
      "Anonymous Koala", 
      "Anonymous Komodo Dragon", 
      "Anonymous Kudu", 
      "Anonymous Labradoodle", 
      "Anonymous Labrador Retriever", 
      "Anonymous Ladybird", 
      "Anonymous Leaf-Tailed Gecko", 
      "Anonymous Lemming", 
      "Anonymous Lemur", 
      "Anonymous Leopard", 
      "Anonymous Leopard Cat", 
      "Anonymous Leopard Seal", 
      "Anonymous Leopard Tortoise", 
      "Anonymous Liger", 
      "Anonymous Lion", 
      "Anonymous Lionfish", 
      "Anonymous Little Penguin", 
      "Anonymous Lizard", 
      "Anonymous Llama", 
      "Anonymous Lobster", 
      "Anonymous Long-Eared Owl", 
      "Anonymous Lynx", 
      "Anonymous ", 
      "Anonymous Macaroni Penguin", 
      "Anonymous Macaw", 
      "Anonymous Magellanic Penguin", 
      "Anonymous Magpie", 
      "Anonymous Maine Coon", 
      "Anonymous Malayan Civet", 
      "Anonymous Malayan Tiger", 
      "Anonymous Maltese", 
      "Anonymous Manatee", 
      "Anonymous Mandrill", 
      "Anonymous Manta Ray", 
      "Anonymous Marine Toad", 
      "Anonymous Markhor", 
      "Anonymous Marsh Frog", 
      "Anonymous Masked Palm Civet", 
      "Anonymous Mastiff", 
      "Anonymous Mayfly", 
      "Anonymous Meerkat", 
      "Anonymous Millipede", 
      "Anonymous Minke Whale", 
      "Anonymous Mole", 
      "Anonymous Molly", 
      "Anonymous Mongoose", 
      "Anonymous Mongrel", 
      "Anonymous Monitor Lizard", 
      "Anonymous Monkey", 
      "Anonymous Monte Iberia Eleuth", 
      "Anonymous Moorhen", 
      "Anonymous Moose", 
      "Anonymous Moray Eel", 
      "Anonymous Moth", 
      "Anonymous Mountain Gorilla", 
      "Anonymous Mountain Lion", 
      "Anonymous Mouse", 
      "Anonymous Mule", 
      "Anonymous Neanderthal", 
      "Anonymous Neapolitan Mastiff", 
      "Anonymous Newfoundland", 
      "Anonymous Newt", 
      "Anonymous Nightingale", 
      "Anonymous Norfolk Terrier", 
      "Anonymous Norwegian Forest", 
      "Anonymous Numbat", 
      "Anonymous Nurse Shark", 
      "Anonymous Ocelot", 
      "Anonymous Octopus", 
      "Anonymous Okapi", 
      "Anonymous Old English Sheepdog", 
      "Anonymous Olm", 
      "Anonymous Opossum", 
      "Anonymous Orang-utan", 
      "Anonymous Ostrich", 
      "Anonymous Otter", 
      "Anonymous Oyster", 
      "Anonymous Pademelon", 
      "Anonymous Panther", 
      "Anonymous Parrot", 
      "Anonymous Patas Monkey", 
      "Anonymous Peacock", 
      "Anonymous Pekingese", 
      "Anonymous Pelican", 
      "Anonymous Penguin", 
      "Anonymous Persian", 
      "Anonymous Pheasant", 
      "Anonymous Pied Tamarin", 
      "Anonymous Pig", 
      "Anonymous Pika", 
      "Anonymous Pike", 
      "Anonymous Pink Fairy Armadillo", 
      "Anonymous Piranha", 
      "Anonymous Platypus", 
      "Anonymous Pointer", 
      "Anonymous Poison Dart Frog", 
      "Anonymous Polar Bear", 
      "Anonymous Pond Skater", 
      "Anonymous Poodle", 
      "Anonymous Pool Frog", 
      "Anonymous Porcupine", 
      "Anonymous Possum", 
      "Anonymous Prawn", 
      "Anonymous Proboscis Monkey", 
      "Anonymous Puffer Fish", 
      "Anonymous Puffin", 
      "Anonymous Pug", 
      "Anonymous Puma", 
      "Anonymous Purple Emperor", 
      "Anonymous Puss Moth", 
      "Anonymous Pygmy Hippopotamus", 
      "Anonymous Pygmy Marmoset", 
      "Anonymous Quail", 
      "Anonymous Quetzal", 
      "Anonymous Quokka", 
      "Anonymous Quoll", 
      "Anonymous Rabbit", 
      "Anonymous Raccoon", 
      "Anonymous Raccoon Dog", 
      "Anonymous Radiated Tortoise", 
      "Anonymous Ragdoll", 
      "Anonymous Rat", 
      "Anonymous Rattlesnake", 
      "Anonymous Red Knee Tarantula", 
      "Anonymous Red Panda", 
      "Anonymous Red Wolf", 
      "Anonymous Red-handed Tamarin", 
      "Anonymous Reindeer", 
      "Anonymous Rhinoceros", 
      "Anonymous River Dolphin", 
      "Anonymous River Turtle", 
      "Anonymous Robin", 
      "Anonymous Rock Hyrax", 
      "Anonymous Rockhopper Penguin", 
      "Anonymous Roseate Spoonbill", 
      "Anonymous Rottweiler", 
      "Anonymous Royal Penguin", 
      "Anonymous Russian Blue", 
      "Anonymous Sabre-Toothed Tiger", 
      "Anonymous Saint Bernard", 
      "Anonymous Salamander", 
      "Anonymous Sand Lizard", 
      "Anonymous Saola", 
      "Anonymous Scorpion", 
      "Anonymous Scorpion Fish", 
      "Anonymous Sea Dragon", 
      "Anonymous Sea Lion", 
      "Anonymous Sea Otter", 
      "Anonymous Sea Slug", 
      "Anonymous Sea Squirt", 
      "Anonymous Sea Turtle", 
      "Anonymous Sea Urchin", 
      "Anonymous Seahorse", 
      "Anonymous Seal", 
      "Anonymous Serval", 
      "Anonymous Sheep", 
      "Anonymous Shih Tzu", 
      "Anonymous Shrimp", 
      "Anonymous Siamese", 
      "Anonymous Siamese Fighting Fish", 
      "Anonymous Siberian", 
      "Anonymous Siberian Husky", 
      "Anonymous Siberian Tiger", 
      "Anonymous Silver Dollar", 
      "Anonymous Skunk", 
      "Anonymous Sloth", 
      "Anonymous Slow Worm", 
      "Anonymous Snail", 
      "Anonymous Snake", 
      "Anonymous Snapping Turtle", 
      "Anonymous Snowshoe", 
      "Anonymous Snowy Owl", 
      "Anonymous Somali", 
      "Anonymous South China Tiger", 
      "Anonymous Spadefoot Toad", 
      "Anonymous Sparrow", 
      "Anonymous Spectacled Bear", 
      "Anonymous Sperm Whale", 
      "Anonymous Spider Monkey", 
      "Anonymous Spiny Dogfish", 
      "Anonymous Sponge", 
      "Anonymous Squid", 
      "Anonymous Squirrel", 
      "Anonymous Squirrel Monkey", 
      "Anonymous Sri Lankan Elephant", 
      "Anonymous Staffordshire Bull Terrier", 
      "Anonymous Stag Beetle", 
      "Anonymous Starfish", 
      "Anonymous Stellers Sea Cow", 
      "Anonymous Stick Insect", 
      "Anonymous Stingray", 
      "Anonymous Stoat", 
      "Anonymous Striped Rocket Frog", 
      "Anonymous Sumatran Elephant", 
      "Anonymous Sumatran Orang-utan", 
      "Anonymous Sumatran Rhinoceros", 
      "Anonymous Sumatran Tiger", 
      "Anonymous Sun Bear", 
      "Anonymous Swan", 
      "Anonymous Tang", 
      "Anonymous Tapanuli Orang-utan", 
      "Anonymous Tapir", 
      "Anonymous Tarsier", 
      "Anonymous Tasmanian Devil", 
      "Anonymous Tawny Owl", 
      "Anonymous Termite", 
      "Anonymous Tetra", 
      "Anonymous Thorny Devil", 
      "Anonymous Tibetan Mastiff", 
      "Anonymous Tiffany", 
      "Anonymous Tiger", 
      "Anonymous Tiger Salamander", 
      "Anonymous Tiger Shark", 
      "Anonymous Tortoise", 
      "Anonymous Toucan", 
      "Anonymous Tree Frog", 
      "Anonymous Tropicbird", 
      "Anonymous Tuatara", 
      "Anonymous Turkey", 
      "Anonymous Turkish Angora", 
      "Anonymous Uakari", 
      "Anonymous Uguisu", 
      "Anonymous Umbrellabird", 
      "Anonymous Vampire Bat", 
      "Anonymous Vervet Monkey", 
      "Anonymous Vulture", 
      "Anonymous Wallaby", 
      "Anonymous Walrus", 
      "Anonymous Warthog", 
      "Anonymous Wasp", 
      "Anonymous Water Buffalo", 
      "Anonymous Water Dragon", 
      "Anonymous Water Vole", 
      "Anonymous Weasel", 
      "Anonymous Welsh Corgi", 
      "Anonymous West Highland Terrier", 
      "Anonymous Western Gorilla", 
      "Anonymous Western Lowland Gorilla", 
      "Anonymous Whale Shark", 
      "Anonymous Whippet", 
      "Anonymous White Faced Capuchin", 
      "Anonymous White Rhinoceros", 
      "Anonymous White Tiger", 
      "Anonymous Wild Boar", 
      "Anonymous Wildebeest", 
      "Anonymous Wolf", 
      "Anonymous Wolverine", 
      "Anonymous Wombat", 
      "Anonymous Woodlouse", 
      "Anonymous Woodpecker", 
      "Anonymous Woolly Mammoth", 
      "Anonymous Woolly Monkey", 
      "Anonymous Wrasse", 
      "Anonymous X-Ray Tetra", 
      "Anonymous Yak", 
      "Anonymous Yellow-Eyed Penguin", 
      "Anonymous Yorkshire Terrier", 
      "Anonymous Zebra", 
      "Anonymous Zebra Shark", 
      "Anonymous Zebu", 
      "Anonymous Zonkey", 
      "Anonymous Zorse"
    ];

    var name = names[Math.floor(Math.random() * names.length)];

    return name;
  }
}

export default CreateRoom;
