import socketIOClient from "socket.io-client";

const endpoint = window.location.hostname + ":" + 8000;
const socket = socketIOClient(endpoint);

// adds an extra field to the socket object which holds the username associated with the socket
socket["username"] = socket.id;

export default socket;