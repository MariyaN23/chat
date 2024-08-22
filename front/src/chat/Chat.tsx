import React, {useEffect, useRef, useState} from 'react';
import {useSelector} from "react-redux";
import {selectMessages, selectTypingUsers} from "../store/chat-selectors";
import {useActions} from "../store/redux-utils";
import {chatActions} from "../store";
import {MessageType, UserType} from "../store/types";

export const Chat = () => {
    console.log('render app')
    const allMessages = useSelector(selectMessages)
    const allTypingUsers = useSelector(selectTypingUsers)
    const {createConnection, destroyConnection, setClientName, setNewMessage, messageIsTyping} = useActions(chatActions)

    useEffect(() => {
        createConnection()
        return () => {
            destroyConnection()
        }
    }, [])

    const [message, setMessage] = useState<string>('')
    const [error, setError] = useState<string | null>(null)
    const sendMessageHandler = () => {
        if (message.trim().length && message.length < 20) {
            setNewMessage(message)
            setMessage('')
        } else {
            setError('Message is too long')
        }
    }

    const setMessageHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.currentTarget.value)
        setError(null)
    }

    const [name, setName] = useState<string>('')

    const sendNameHandler = () => {
        if (name.trim().length) {
            setClientName(name)
        }
    }

    const [isAutoScrollActive, setIsAutoScrollActive] = useState<boolean>(true)
    const [lastScrollTop, setLastScrollTop] = useState<number>(0)
    const messagesAnchorRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        if (isAutoScrollActive) {
            messagesAnchorRef.current?.scrollIntoView({behavior: 'smooth'})
        }
    }, [allMessages])

    const typeMessageHandler = () => {
        messageIsTyping()
    }

    return (
        <div>
            <div style={{
                border: '1px solid black',
                padding: '10px',
                height: '300px',
                width: '300px',
                overflowY: 'scroll'
            }} onScroll={(e) => {
                const element = e.currentTarget
                const maxScrollPosition = element.scrollHeight - element.clientHeight
                const scrollCondition = Math.abs(maxScrollPosition - element.scrollTop) < 10
                if (element.scrollTop > lastScrollTop && scrollCondition) {
                    setIsAutoScrollActive(true)
                } else {
                    setIsAutoScrollActive(false)
                }
                setLastScrollTop(element.scrollTop)
            }}>
                {allMessages.map((m: MessageType) => {
                    return <div key={m.messageId}>
                        <b>{m.user.name}:</b> {m.message}
                        <hr/>
                    </div>
                })}
                <div ref={messagesAnchorRef}></div>
            </div>

            <div>
                {allTypingUsers.map((u: UserType) => {
                    return <div key={u.userId}>
                        <p>{u.name} is typing...</p>
                    </div>
                })}
            </div>

            <div>
                <input value={name} onChange={(e) => setName(e.currentTarget.value)}/>
                <button onClick={sendNameHandler}>Name in chat</button>
            </div>

            <div>
                <textarea value={message}
                          onChange={setMessageHandler}
                          onKeyUp={typeMessageHandler}>
                </textarea>
                <button onClick={sendMessageHandler}>Send</button>
                {error && <div>{error}</div>}
            </div>
        </div>
    )
}