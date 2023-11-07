// Get the chat input and chat history elements
const chatInput = document.getElementById('chat-input');
const chatHistory = document.querySelector('.chat-history');
const sendButton = document.getElementById('send-button');

// Add an event listener to the chat input form
sendButton.addEventListener('click', (event) => {
    event.preventDefault(); // prevent form submission

    // Get the user's message from the chat input field
    const message = chatInput.value;

    // Create a new chat message element
    const chatMessage = document.createElement('li');
    chatMessage.innerHTML = `<span class="username">You:</span> ${message}`;
    const messages = document.querySelectorAll('.chat-message');
    
    // Add the chat message to the chat history
    chatHistory.appendChild(chatMessage);

    // Clear the chat input field
    chatInput.value = '';
});
