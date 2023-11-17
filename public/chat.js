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
    
    //this is a joke for halloween
    if (chatHistory.children.length === 2) {
        addMessage("BOO!", 'Ghost');
    }

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
