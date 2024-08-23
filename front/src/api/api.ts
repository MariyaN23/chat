import {io, Socket} from "socket.io-client";
import {AllMessagesType, MessageType, UserType} from "../store/types";

export const api = {
    socket: null as null | Socket,
    setConnection() {
        //this.socket = io('http://localhost:3009')
        this.socket = io('https://capybara-chat.onrender.com/')
    },
    subscribe(initMessagesPublished: (messages: AllMessagesType, fn: ()=> void) => void,
              newMessageSent: (message: MessageType) => void,
              userTypedMessage: (user: UserType) => void
    ) {
        this.socket?.on('init-messages-published', initMessagesPublished)
        this.socket?.on('new-message-sent', newMessageSent)
        this.socket?.on('user-typing', userTypedMessage)
    },
    sendName(name: string) {
        this.socket?.emit('client-name-set', name)
    },
    sendMessage(message: string) {
        this.socket?.emit('client-message-sent', message, (error: string | null)=> {
            if (error) {
                console.log(error)
            }
        })
    },
    clientTypedMessage() {
        this.socket?.emit('client-typed')
    },
    setDisconnect() {
        this.socket?.disconnect()
        this.socket = null
    }
}
