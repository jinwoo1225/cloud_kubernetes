import { io } from "socket.io-client";
const HOST = process.env.HOST || "localhost";
const PORT = process.env.PORT || "4000";

const socket = io(`http://${HOST}:${PORT}`);

console.log(`connecting ${HOST}:${PORT}`);

socket.on("connection", () => {
  console.log("connected id :", socket.id);
});

socket.on("connect_error", (err) => {
  console.log(err);
});

// 10초마다 서버에 요청을 보냄
setInterval(() => {
  console.log(`seding a message to ${HOST}:${PORT}`)
  socket.emit("msg", new Date());
}, 10 * 1000);
