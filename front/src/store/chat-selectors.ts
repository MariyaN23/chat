import {AppRootStateType} from "./types";

export const selectMessages = (state: AppRootStateType) => state.chat.messages
export const selectTypingUsers = (state: AppRootStateType) => state.chat.typingUsers