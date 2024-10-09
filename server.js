const express = require('express');
const fetch = require('node-fetch');
const app = express();
const port = 3000;

const API_TOKEN = '7673978588:AAG01w7E48JEkHTIQ74S9pIHtiPgUw0iz9A'; // Your Telegram bot API token
const API_URL = `https://api.telegram.org/bot${API_TOKEN}`;

// Middleware to parse JSON requests
app.use(express.json());
app.use(express.static('public')); // Serve static files from the 'public' directory

// Endpoint to send messages to a Telegram user
app.post('/sendMessage', (req, res) => {
    const { chatId, text } = req.body;

    fetch(`${API_URL}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: text }),
    })
    .then(response => response.json())
    .then(data => res.send(data))
    .catch(error => res.status(500).send(error));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
