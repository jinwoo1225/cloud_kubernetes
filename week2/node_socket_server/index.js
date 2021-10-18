"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const app = express();
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, { cors: { origin: '*' } });
const PORT = process.env.PORT || 4000;
let number = 0;
io.on("connection", (socket) => {
    console.log("connected", socket.id);
    socket.on("hello", (msg) => {
        console.log(msg);
        socket.emit("hello", "hi client?");
    });
});
httpServer.listen(PORT);
console.log(`creating server at ${PORT}`);
//# sourceMappingURL=index.js.map