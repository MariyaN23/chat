import React from 'react';
import './App.css';

function App() {
    const [messages, setMessages] = React.useState([
        {message: 'Hello', messageId: '545sdsd4sd', user: {userId: '45sdgsddd', name: 'Dimych'}},
        {message: 'Hello, world', messageId: '548ahgfad47', user: {userId: 'ada11311de', name: 'Oleg'}},
    ])
    return (
        <div className="App">
            <div>
                <div>
                    <div style={{
                        border: '1px solid black',
                        padding: '10px',
                        height: '300px',
                        width: '300px',
                        overflowY: 'scroll'
                    }}>
                        {messages.map(m => {
                            return <div>
                                <b>{m.user.name}:</b> {m.message}
                                <hr/>
                            </div>
                        })}
                    </div>
                    <textarea></textarea>
                    <button>Send</button>
                </div>
            </div>
        </div>
    )
}

export default App;
