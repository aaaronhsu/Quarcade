let io;

const socketList = {};

module.exports = {
  init: (http) => {
    io = require("socket.io")(http);

    // when a user connects to the server, this detects the socket connection and adds the socket id to a list
    io.on("connection", (client) => {
      console.log(`A user has connected with id ${client.id}`);

      socketList.concat(client.id);

      // when a user disconnects from the server, this detects the socket disconnection and removes the socket id from the list
      io.on("disconnect", () => {
        delete socketList(client.id);
      })
    });
  }
};