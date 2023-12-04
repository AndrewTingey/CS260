//Adjust the websocket protocol to use the same port as the HTTP server:
const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
const socket = new WebSocket(`${protocol}://${window.location.host}/ws`);

// Get the chat input and chat history elements
const sendButton = document.getElementById('send-button');

// Add an event listener to the chat input form
sendButton.addEventListener('click', (event) => {
    event.preventDefault(); // prevent form submission

    const chatInput = document.getElementById('chat-input');

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
    const chatHistory = document.querySelector('.chat-history');
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
    setOnline();
};

//recieving messages
socket.onmessage = async (event) => {

    console.log("Received message: ", event.data);
    let data;
    //TODO fix this hack, sometimes its a blob, sometimes its not
    //must be with how data is sent
    if(event.data instanceof Blob) {
        const text = await event.data.text();
        data = JSON.parse(text);
    } else {
        data = JSON.parse(event.data);
    }

    if (data.type === 'chatMessage') {
        const chat = data.data;
        addMessage(chat.message, chat.username);
    } else if (data.type === 'gameMove') {
        const gameID = data.gameID;
        const gameMove = data.data;
        console.log(gameMove);
    } else if (data.type === 'joinGame') {
        console.log("Join game");
        const gameID = data.gameID;
        console.log("Game ID: ", gameID);
        const response = await fetch(`/api/game/${gameID}`);
        const gameDetails = await response.json();

        console.log("Game Details: ", gameDetails);

        addMessage(`${gameDetails.opponent} joined the game`, 'System');
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

function broadcastToGame() {
    console.log("Broadcasting to game");
}

function setOnline() {
    console.log("setOnline");

    const message = {
        type: 'joinGame',
        gameID: localStorage.getItem("gameID"),
        data: {
            username: localStorage.getItem("username"),
        }
    }

    socket.send(JSON.stringify(message));
}