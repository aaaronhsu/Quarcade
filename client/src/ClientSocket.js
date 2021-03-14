import socketIOClient from "socket.io-client";

const endpoint = window.location.hostname + ":" + 8000;
const socket = socketIOClient(endpoint);

socket.on("connect", () => {
  // post("/api/initsocket", { socketid: socket.id });
  console.log("connected to server");
});

export default socket;