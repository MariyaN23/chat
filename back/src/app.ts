import {Server} from 'socket.io'
import express from 'express'
import {createServer} from 'http'
import cors from 'cors'

const app = express()
const server = createServer(app)

//options for cors!
const socket = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
})
app.use(cors())

app.get('/', (req, res) => {
    res.send(`Hello, it's ws server`)
})

const usersState = new Map()

const messages = [
    {message: 'Hello', messageId: '545sdsd4sd', user: {userId: '45sdgsddd', name: 'Dimych'}},
    {message: 'Hello, world', messageId: '548ahgfad47', user: {userId: 'ada11311de', name: 'Oleg'}},
    {message: 'Hiiii', messageId: '545ad56adj', user: {userId: '45sdgsddd', name: 'Dimych'}},
]

socket.on('connection', (socketChannel) => {
    usersState.set(socketChannel, {userId: new Date().getTime().toString(), name: 'Anonymous'})
    socketChannel.on('client-name-set', (name: string)=> {
        if (typeof name !== 'string') {
            return
        }
        const user = usersState.get(socketChannel)
        user.name = name
    })

    socketChannel.on('client-typed', ()=> {
        socketChannel.broadcast.emit('user-typing', usersState.get(socketChannel))
    })

    socketChannel.on('client-message-sent', (message: string, successFn) => {
        if (typeof message !== 'string' || message.length > 20) {
            successFn('Message length should be less than 20 characters')
            return
        }
        const user = usersState.get(socketChannel)
        const newMessage = {
            message: message,
            messageId: new Date().getTime().toString(),
            user: {userId: user.userId, name: user.name}
        }
        console.log(`user send message: ${message}`)
        messages.push(newMessage)
        socket.emit('new-message-sent', newMessage)
        successFn(null)
    })
    socketChannel.emit('init-messages-published', messages, (data: string)=> {
        console.log(`init message received: ${data}`)
    })
    console.log('a user connected')

    socket.on('disconnect', (socketChannel) => {
        usersState.delete(socketChannel)
    })
})

//for environment variables
const PORT = process.env.PORT || 3009

server.listen(PORT, () => {
    console.log('listening on 3009')
})