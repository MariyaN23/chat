import {store} from "./store";
import {rootReducer} from "./reducers";

export type UserType = {
    userId: string
    name: string
}

export type MessageType = {
    message: string
    messageId: string
    user: UserType
}

export type AllMessagesType = MessageType[]
export type AllTypingUsersType = UserType[]

export type RootReducerType = typeof rootReducer
export type AppDispatchType = typeof store.dispatch
export type AppRootStateType = ReturnType<RootReducerType>