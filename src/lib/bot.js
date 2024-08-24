const TelegramBot = require('node-telegram-bot-api')
const bot = new TelegramBot(process.env.BOT_TOKEN_PAYMENT, { polling: true });

module.exports = bot