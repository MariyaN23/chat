import express from 'express'
import http from 'http'
import socketio from 'socket.io'

const app = express()
const server = http.createServer(app)
// @ts-ignore
const io = socketio(server)

app.get('/', (req, res)=> {
    res.send(`Hello, it's ws server`)
})

io.on('connection', (socket) => {
    console.log('a user connected')
})

server.listen(3009, ()=> {
    console.log('listening on 3009')
})