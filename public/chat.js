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
    socket.send('{"username": "' + name + '", "message": "' + message + '"}');

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

socket.onmessage = async (event) => {
    const text = await event.data.text();
    const chat = JSON.parse(text);
    addMessage(chat.message, chat.username); //this is different
};

socket.onclose = (event) => {
    addMessage('Disconnected!', 'System');
}

