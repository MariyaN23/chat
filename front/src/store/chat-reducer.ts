import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AllMessagesType, AllTypingUsersType, MessageType, UserType} from "./types";

type initialStateType = {
    messages: AllMessagesType
    typingUsers: AllTypingUsersType
}

const initialState: initialStateType = {
    messages: [],
    typingUsers: []
}

export const slice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        allMessagesReceived(state, action: PayloadAction<AllMessagesType>) {
            state.messages = action.payload
        },
        newMessageReceived(state, action: PayloadAction<MessageType>) {
            state.messages.push(action.payload)
            state.typingUsers = state.typingUsers.filter(u => u.userId !== action.payload.user.userId)
        },
        addTypingUser(state, action: PayloadAction<UserType>) {
            if (!state.typingUsers.some(u => u.userId === action.payload.userId)) {
                state.typingUsers.push(action.payload)
            }
        }
    }
})

export const {allMessagesReceived, newMessageReceived, addTypingUser} = slice.actions