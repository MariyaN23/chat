"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
//options for cors!
const socket = new socket_io_1.Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});
app.use((0, cors_1.default)());
app.get('/', (req, res) => {
    res.send(`Hello, it's ws server`);
});
const usersState = new Map();
const messages = [
    { message: 'Hello', messageId: '545sdsd4sd', user: { userId: '45sdgsddd', name: 'Dimych' } },
    { message: 'Hello, world', messageId: '548ahgfad47', user: { userId: 'ada11311de', name: 'Oleg' } },
    { message: 'Hiiii', messageId: '545ad56adj', user: { userId: '45sdgsddd', name: 'Dimych' } },
];
socket.on('connection', (socketChannel) => {
    usersState.set(socketChannel, { userId: new Date().getTime().toString(), name: 'Anonymous' });
    socketChannel.on('client-name-set', (name) => {
        if (typeof name !== 'string') {
            return;
        }
        const user = usersState.get(socketChannel);
        user.name = name;
    });
    socketChannel.on('client-typed', () => {
        socketChannel.broadcast.emit('user-typing', usersState.get(socketChannel));
    });
    socketChannel.on('client-message-sent', (message, successFn) => {
        if (typeof message !== 'string' || message.length > 20) {
            successFn('Message length should be less than 20 characters');
            return;
        }
        const user = usersState.get(socketChannel);
        const newMessage = {
            message: message,
            messageId: new Date().getTime().toString(),
            user: { userId: user.userId, name: user.name }
        };
        console.log(`user send message: ${message}`);
        messages.push(newMessage);
        socket.emit('new-message-sent', newMessage);
        successFn(null);
    });
    socketChannel.emit('init-messages-published', messages, (data) => {
        console.log(`init message received: ${data}`);
    });
    console.log('a user connected');
    socket.on('disconnect', (socketChannel) => {
        usersState.delete(socketChannel);
    });
});
//for environment variables
const PORT = process.env.PORT || 3009;
server.listen(PORT, () => {
    console.log('listening on 3009');
});
//# sourceMappingURL=app.js.map