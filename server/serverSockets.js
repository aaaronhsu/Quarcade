const socketio = require('socket.io');

const socketList = {
  unassigned: [],
};

const socketLocation = {

};

const getAllSocketsFromRoom = (room) => {
  if (room in sockteList) return socketList[room];
  return [];
}

const retrieveUser = (socketid) => {
  if (!socketLocation.hasOwnProperty(room)) return null;
  return socketLocation[socketid];
}

// removes user from their current room and adds them to a new room
const addUser = (socketid, room) => {
  // fetch where the user currently is located (usually in the unassigned list)
  let userLocation = socketLocation[socketid];

  // remove the user from the unassigned list
  socketList[userLocation].splice(socketList[userLocation].indexOf(socketid), 1);

  // if the room that the user is being moved to doesn't exist, create it
  if (!socketList.hasOwnProperty(room)) socketList[room] = [];

  // add the user to the room
  socketList[room].push(socketid);

  // update where the user is located
  socketLocation[socketid] = room;
};

module.exports = {
  init: (http) => {
    io = socketio(http, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      },
    });

    // when a user connects to the server, this detects the socket connection and adds the socket id to a list
    io.on("connection", (client) => {

      // adds user to the roomless socket list
      socketList.unassigned.push(client.id);
      // adds an address so we know which room the user is in
      socketLocation[client.id] = "unassigned";

      client.on("printConnectedSockets", () => {
        console.log("List of all connected sockets:", socketList);
      });
    
      // when a user disconnects from the server, this detects the socket disconnection and removes the socket id from the list
      client.on("disconnect", () => {

        // fetches where the user is (which room)
        let userLocation = socketLocation[client.id];

        // deletes user from the specific room
        socketList[userLocation].splice(socketList[userLocation].indexOf(client.id), 1);

        // if there are no more users in the room, delete the room
        if (userLocation !== "unassigned" && socketList[userLocation].length == 0) delete socketList[userLocation];

        // remove the address to the user
        delete socketLocation[client.id];
      })
    });
  },

  addUser: addUser,
  retrieveUser: retrieveUser,
  getAllSocketsFromRoom: getAllSocketsFromRoom,
};