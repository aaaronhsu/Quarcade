import socketIOClient from "socket.io-client";

const endpoint = window.location.hostname + ":" + 8000;
const socket = socketIOClient(endpoint);

export default socket;