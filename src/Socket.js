import io from "socket.io-client";
import toast from "react-hot-toast";
const config = require("./config.js");

var connectionOptions = {
  "force new connection": true,
  reconnectionAttempts: "Infinity",
  timeout: 10000,
  transports: ["websocket"],
};

export const socket = io(
  process.env.NODE_ENV === "development" ? config.HOST_DEVELOPMENT : config.HOST_LIVE,
  // "ws://144.91.93.36:3006",
  // "wss://rustysaloon.com",
  connectionOptions
);

socket.on("message", ({ type, msg }) => {
  if (type === "error") {
    toast.error(msg)
  } else if (type === "success") {
    toast.success(msg)
  }
});
