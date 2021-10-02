"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_client_1 = require("socket.io-client");
const HOST = process.env.HOST || "localhost";
const PORT = process.env.PORT || "4000";
const socket = (0, socket_io_client_1.io)(`http://${HOST}:${PORT}`);
console.log(`connecting ${HOST}:${PORT}`, {});
socket.on('connection', () => {
    console.log('connected', socket.id);
});
socket.on('connect_error', (err) => {
    socket.io.opts.transports = ["polling", "websocket"];
    console.log(err);
});
//# sourceMappingURL=index.js.map