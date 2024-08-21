import React, {useEffect, useState} from 'react';
import './App.css';
import {io} from "socket.io-client";

type UserType = {
    userId: string
    name: string
}

type MessageType = {
    message: string
    messageId: string
    user: UserType
}

export type AllMessagesType = MessageType[]

const socket = io('http://localhost:3009/')

function App() {
    useEffect(() => {
        socket.on('init-messages-published', initMessagePublished)
        socket.on('new-message-sent', newMessageSent)
        return () => {
            socket.off('init-messages-published', initMessagePublished)
            socket.off('new-message-sent', newMessageSent)
        }
    }, [])

    const initMessagePublished = (messages: AllMessagesType) => {
        setAllMessages(messages)
    }
    const newMessageSent = (message: MessageType) => {
        setAllMessages((prevMessages) => [...prevMessages, message])
    }

    const [allMessages, setAllMessages] = useState<AllMessagesType>([])

    const [message, setMessage] = useState('')

    const sendMessageHandler = () => {
        if (message.trim().length) {
            socket.emit('client-message-sent', message)
        }
        setMessage('')
    }

    const [name, setName] = useState('')

    const sendNameHandler = () => {
        if (name.trim().length) {
            socket.emit('client-name-set', name)
        }
    }

    useEffect(() => {

    }, [allMessages])

    return (
        <div className="App">
            <div>
                <div>
                    <div style={{
                        border: '1px solid black',
                        padding: '10px',
                        height: '300px',
                        width: '300px',
                        overflowY: 'scroll'
                    }}>
                        {allMessages.map(m => {
                            return <div key={m.messageId}>
                                <b>{m.user.name}:</b> {m.message}
                                <hr/>
                            </div>
                        })}
                    </div>

                    <div>
                        <input value={name} onChange={(e) => setName(e.currentTarget.value)}/>
                        <button onClick={sendNameHandler}>Name in chat</button>
                    </div>

                    <div>
                        <textarea value={message}
                                  onChange={(e) => setMessage(e.currentTarget.value)}>
                    </textarea>
                        <button onClick={sendMessageHandler}>Send</button>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default App;
