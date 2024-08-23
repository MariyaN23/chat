import React from 'react';
import {Chat} from "./chat/Chat";
import {Provider} from "react-redux";
import {store} from "./store/store";


function App() {
    return (
        <Provider store={store}>
            <Chat/>
        </Provider>
    )
}

export default App;
