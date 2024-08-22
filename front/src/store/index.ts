import {slice} from './chat-reducer'
import * as chatAsyncActions from './chat-actions'
import * as chatSelectors from './chat-selectors'

const chatReducer = slice.reducer
const chatActions = {...chatAsyncActions, ...slice.actions}

export {
    chatReducer,
    chatActions,
    chatSelectors
}