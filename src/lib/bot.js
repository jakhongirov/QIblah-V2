const TelegramBot = require('node-telegram-bot-api')
const bot = new TelegramBot(process.env.BOT_TOKEN_PAYMENT, { polling: true });
const secondBot = new TelegramBot(process.env.SECOND_BOT_TOKEN, { polling: true });

module.exports = { bot, secondBot }