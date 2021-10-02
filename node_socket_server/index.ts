import * as express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors:{origin:'*'} });

const PORT = process.env.PORT || 4000

let number = 0;

io.on("connection", (socket: Socket) => {
  console.log("connected", socket.id)
  socket.on("msg", (msg :Date) => {
    console.log(msg.toString(), number++);
  });
});

httpServer.listen(PORT)

console.log(`creating server at ${PORT}`)