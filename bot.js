const TelegramBot = require('node-telegram-bot-api');

// Replace with your actual bot token
const token = '7673978588:AAG01w7E48JEkHTIQ74S9pIHtiPgUw0iz9A';

// Create a bot that uses polling to fetch new updates
const bot = new TelegramBot(token, { polling: true });

// Respond to the /start command
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const message = "Welcome to the StarCoin Bot!";
    const options = {
        reply_markup: {
            inline_keyboard: [
                [{ text: "Play Games", url: "https://shorturl.at/TNcMl" }]
            ]
        }
    };

    // Send a message with a Play Games button
    bot.sendMessage(chatId, message, options);
});
