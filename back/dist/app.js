"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = __importDefault(require("socket.io"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
// @ts-ignore
const io = (0, socket_io_1.default)(server);
app.get('/', (req, res) => {
    res.send(`Hello, it's ws server`);
});
io.on('connection', (socket) => {
    console.log('a user connected');
});
server.listen(3009, () => {
    console.log('listening on 3009');
});
//# sourceMappingURL=app.js.map