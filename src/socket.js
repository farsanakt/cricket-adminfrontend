import { io } from "socket.io-client";

const socket = io(
  "http://168.144.149.133:5000/api"
);

export default socket;