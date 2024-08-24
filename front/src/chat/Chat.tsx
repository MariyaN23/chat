import React, {useEffect, useRef, useState} from 'react';
import {useSelector} from "react-redux";
import {selectMessages, selectTypingUsers} from "../store/chat-selectors";
import {useActions} from "../store/redux-utils";
import {chatActions} from "../store";
import {MessageType, UserType} from "../store/types";
import styles from '../chat/Chat.module.scss'
import logo from '../assets/images/capybara-logo.jpg'

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
        const newMessage = message.trim()
        if (newMessage.length === 0) {
            setError(`Message is empty`)
        }
        if (newMessage.length >= 20) {
            setError(`Message is too long`)
        } else if (newMessage.length && message.length < 20) {
            setNewMessage(message)
            setMessage('')
        }
    }

    const setMessageHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.currentTarget.value)
        setError(null)
    }

    const [name, setName] = useState<string>('')
    const [nameError, setNameError] = useState<string>('')
    const [disabled, setDisabled] = useState<boolean>(false)
    const sendNameHandler = () => {
        const newName = name.trim()
        if (newName.length === 0) {
            setNameError(`Name shouldn't be empty`)
        }
        if (newName.length >= 20) {
            setNameError(`Name is too long`)
        } else if (newName.length && newName.length < 20) {
            setClientName(name)
            setNameError('')
            setDisabled(true)
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

    const setScrollHandler = (e: React.UIEvent<HTMLElement>) => {
        const element = e.currentTarget
        const maxScrollPosition = element.scrollHeight - element.clientHeight
        const scrollCondition = Math.abs(maxScrollPosition - element.scrollTop) < 10
        if (element.scrollTop > lastScrollTop && scrollCondition) {
            setIsAutoScrollActive(true)
        } else {
            setIsAutoScrollActive(false)
        }
        setLastScrollTop(element.scrollTop)
    }

    return (
        <div className={styles.chatContainer}>
            <div className={styles.chatHeader}>
                <img src={logo} alt={'chat-logo'}/>
                <div>Capybara chat</div>
            </div>

            <div className={styles.messagesContainer}>
                <div className={styles.messages}>
                    <div onScroll={setScrollHandler}>
                        {allMessages.map((m: MessageType) => {
                            return <div key={m.messageId}>
                                <div className={styles.messageWrapper}>
                                    <b>{m.user.name}</b>
                                    <div className={styles.message}>{m.message}</div>
                                </div>
                            </div>
                        })}
                        <div ref={messagesAnchorRef}></div>
                    </div>
                </div>

                <div>
                    {allTypingUsers.map((u: UserType) => {
                        return <div key={u.userId}>
                            <p>{u.name} is typing...</p>
                        </div>
                    })}
                </div>

                <div className={styles.inputAndTextareaContainer}>
                    <div className={styles.inputWrapper}>
                        {nameError && <span className={styles.error}>{nameError}</span>}
                        <input value={name}
                               onChange={(e) => setName(e.currentTarget.value)}
                               maxLength={20}
                               placeholder={'Your name in chat'}
                               disabled={disabled}
                        />
                        <button onClick={sendNameHandler}
                                disabled={disabled}
                        >Submit
                        </button>
                    </div>

                    <div className={styles.textareaWrapper}>
                        {error && <span className={styles.error}>{error}</span>}
                        <textarea value={message}
                                  onChange={setMessageHandler}
                                  onKeyUp={typeMessageHandler}
                                  maxLength={20}
                                  placeholder={'Type something...'}
                        >
                        </textarea>
                        <button onClick={sendMessageHandler}>Send</button>
                    </div>
                </div>

            </div>
        </div>
    )
}