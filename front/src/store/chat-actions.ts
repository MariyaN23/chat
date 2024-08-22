import {createAsyncThunk} from "@reduxjs/toolkit";
import {api} from "../api/api";
import {AllMessagesType, MessageType, UserType} from "./types";
import {addTypingUser, allMessagesReceived, newMessageReceived} from "./chat-reducer";

export const createConnection = createAsyncThunk('chat/createConnection', (arg, thunkAPI) => {
    try {
        api.setConnection()
        api.subscribe((messages: AllMessagesType, fn: (data: string) => void) => {
                thunkAPI.dispatch(allMessagesReceived(messages))
                fn('data from front')
            },
            (message: MessageType) => {
                thunkAPI.dispatch(newMessageReceived(message))
            },
            (user: UserType) => {
                thunkAPI.dispatch(addTypingUser(user))
            }
        )
    } catch (error: any) {
        thunkAPI.rejectWithValue(null)
    }
})

export const setClientName = createAsyncThunk('chat/setClientName', (name: string, thunkAPI) => {
    try {
        api.sendName(name)
    } catch (error: any) {
        thunkAPI.rejectWithValue(null)
    }
})

export const setNewMessage = createAsyncThunk('chat/setClientName', (message: string, thunkAPI) => {
    try {
        api.sendMessage(message)
    } catch (error: any) {
        thunkAPI.rejectWithValue(null)
    }
})

export const messageIsTyping = createAsyncThunk('chat/messageIsTyping', (arg, thunkAPI) => {
    try {
        api.clientTypedMessage()
    } catch (error: any) {
        thunkAPI.rejectWithValue(null)
    }
})

export const destroyConnection = createAsyncThunk('chat/destroyConnection', (arg, thunkAPI) => {
    try {
        api.setDisconnect()
    } catch (error: any) {
        thunkAPI.rejectWithValue(null)
    }
})