import {combineReducers} from "@reduxjs/toolkit";
import {chatReducer} from "./index";

export const rootReducer = combineReducers({
    chat: chatReducer
})