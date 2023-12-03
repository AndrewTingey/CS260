//Adjust the websocket protocol to use the same port as the HTTP server:
const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
const socket = new WebSocket(`${protocol}://${window.location.host}/ws`);

// Get the chat input and chat history elements
const chatInput = document.getElementById('chat-input');
const chatHistory = document.querySelector('.chat-history');
const sendButton = document.getElementById('send-button');

// Add an event listener to the chat input form
sendButton.addEventListener('click', (event) => {
    event.preventDefault(); // prevent form submission

    // Get the user's message from the chat input field
    const message = chatInput.value;

    addMessage(message, 'You');
    // const name = document.getElementById('name').value;

    const name = localStorage.getItem('username');
    const chatMessage = {
        type: 'chatMessage',
        gameID: localStorage.getItem('gameID'),
        data: {
            username: name,
            message: message
        }
    }
    socket.send(JSON.stringify(chatMessage));

    // Clear the chat input field
    chatInput.value = '';
});

function addMessage(message, username) {
    const chatMessage = document.createElement('li');
    if (username === 'You') {
        chatMessage.innerHTML = `<span class="username" style="color: var(--primary-color)">You:</span> ${message}`;
    } else {
        chatMessage.innerHTML = `<span class="username" style="color: var(--secondary-color)">${username}:</span> ${message}`;
    }
    chatHistory.appendChild(chatMessage);
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

socket.onopen = (event) => {
    addMessage('Connected!', 'System');
};

//recieving messages
socket.onmessage = async (event) => {
    console.log("Recieved message: ", event.data);
    const text = await event.data.text();
    const data = JSON.parse(text);
    if (data.type === 'chatMessage') {
        const chat = data.data;
        addMessage(chat.message, chat.username);
    } else if (data.type === 'gameMove') {
        const gameID = data.gameID;
        const gameMove = data.data;
        console.log(gameMove);
    } else if (data.type === 'joinGame') {
        console.log("Join game");
        console.log("Data: ", data); 
    } else {
        console.log("ERROR: Unknown message type: ", data.type);
    }
};

socket.onerror = (event) => {
    addMessage('Error: ' + event, 'System');
}

socket.onclose = (event) => {
    addMessage('Disconnected!', 'System');
}

