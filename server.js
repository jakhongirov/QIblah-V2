require('dotenv').config()
const express = require("express");
const http = require('http');
const cors = require("cors");
const path = require('path')
const fs = require('fs');
const app = express();
const server = http.createServer(app);
const { PORT } = require("./src/config");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const router = require("./src/modules");
const socket = require('./src/lib/socket')
const TelegramBot = require('node-telegram-bot-api')
const model = require('./model')

const publicFolderPath = path.join(__dirname, 'public');
const imagesFolderPath = path.join(publicFolderPath, 'images');

if (!fs.existsSync(publicFolderPath)) {
   fs.mkdirSync(publicFolderPath);
   console.log('Public folder created successfully.');
} else {
   console.log('Public folder already exists.');
}

if (!fs.existsSync(imagesFolderPath)) {
   fs.mkdirSync(imagesFolderPath);
   console.log('Images folder created successfully.');
} else {
   console.log('Images folder already exists within the public folder.');
}

const bot = new TelegramBot(process.env.BOT_TOKEN, {
   polling: true
})

let user;

bot.on('message', async (msg) => {
   const chatId = msg.chat.id;
   const text = msg.text;
   const [command, ...parameters] = text.split(' ');
   const username = msg.from.first_name

   if (command === '/start') {
      const foundUser = await model.foundUser(parameters[0])
      user = foundUser

      if (foundUser) {
         const content = `
            Assalomu alaykum ${foundUser?.user_name}\nЗдравствуйте ${foundUser?.user_name}
         `;

         bot.sendMessage(chatId, content, {
            reply_markup: {
               inline_keyboard: [
                  [
                     {
                        text: 'Uzbek',
                        callback_data: 'uz'
                     },
                     {
                        text: 'Русский',
                        callback_data: 'ru',
                     },
                  ]
               ]
            }
         })

      } else {
         const content = `
            Assalomu alaykum ${username}, Siz ro'yxatda o'ta olmadiz.\nЗдравствуйте ${username}, Вы не смогли зарегистрироваться.
         `;

         bot.sendMessage(chatId, content, {
            reply_markup: JSON.stringify({
               keyboard:
                  [
                     [
                        {
                           text: "Uzbek"
                        },
                        {
                           text: "Русский"
                        }
                     ]
                  ],
               resize_keyboard: true
            })
         });
      }
   }
});

bot.on('callback_query', async (msg) => {
   const chatId = msg.message.chat.id
   const data = msg.data

   if (data == 'uz') {

      bot.sendMessage(chatId, `${user?.user_name}, kontaktingizni yuboring`, {
         reply_markup: JSON.stringify({
            keyboard:
               [
                  [
                     {
                        text: 'Kontaktni yuborish',
                        request_contact: true,
                        one_time_keyboard: true
                     }
                  ]
               ],
            resize_keyboard: true
         })
      }).then(() => {
         const replyListenerId = bot.on("contact", async (msg) => {
            bot.removeListener(replyListenerId)
            if (msg.contact) {
               const updatedUserPhone = await model.updatedUserPhone(user?.user_id, msg.contact.phone_number)

               if (updatedUserPhone) {
                  bot.sendMessage(msg.chat.id, `Sizning so'rovingiz muvaffaqiyatli qabul qilindi, ilovaga qayting.`)
               }

            }
         })
      })

   } else if (data == "ru") {

      bot.sendMessage(chatId, `${user?.user_name}, отправьте свой контакт`, {
         reply_markup: JSON.stringify({
            keyboard:
               [
                  [
                     {
                        text: 'Отправить контакт',
                        request_contact: true,
                        one_time_keyboard: true
                     }
                  ]
               ],
            resize_keyboard: true
         })
      }).then(() => {
         const replyListenerId = bot.on("contact", async (msg) => {
            bot.removeListener(replyListenerId)
            if (msg.contact) {
               const updatedUserPhone = await model.updatedUserPhone(user?.user_id, msg.contact.phone_number)

               if (updatedUserPhone) {
                  bot.sendMessage(msg.chat.id, `Ваш запрос успешно получен, вернитесь к приложению.`)
               }

            }
         })
      })

   }
})

bot.on("message", msg => {
   const chatId = msg.chat.id
   const text = msg.text

   if (text == "Uzbek") {
      bot.sendMessage(chatId, 'Savolingizni yozib qoldiring. Sizga albatta javob beramiz!', {
         reply_markup: JSON.stringify({
            keyboard:
               [
                  [
                     {
                        text: "Savol berish"
                     }
                  ]
               ],
            resize_keyboard: true
         })
      })
   } else if (text == 'Русский') {
      bot.sendMessage(chatId, 'Напишите свой вопрос. Мы обязательно вам ответим!', {
         reply_markup: JSON.stringify({
            keyboard:
               [
                  [
                     {
                        text: "Задайте вопрос"
                     }
                  ]
               ],
            resize_keyboard: true
         })
      })
   }
})

bot.on('message', (msg) => {
   const chatId = msg.chat.id
   const text = msg.text

   if (text == 'Savol berish') {

      bot.sendMessage(chatId, "Savol:", {
         reply_markup: {
            force_reply: true
         }
      }).then((payload) => {
         const replyListenerId = bot.onReplyToMessage(payload.chat.id, payload.message_id, async (msg) => {
            bot.removeListener(replyListenerId)
            if (msg.text) {
               const content = `Savol: ${msg.text}`;
               await model.addMessage(msg.chat.id, msg.date)
               bot.sendMessage(process.env.CHAT_ID, content)
               bot.sendMessage(chatId, "Sizga tez orada javob berishadi.", {
                  reply_markup: JSON.stringify({
                     keyboard:
                        [
                           [
                              {
                                 text: "Savol berish"
                              }
                           ]
                        ],
                     resize_keyboard: true
                  })
               })
            }
         })
      })
   } else if (text == 'Задайте вопрос') {
      bot.sendMessage(chatId, "Вопрос:", {
         reply_markup: {
            force_reply: true
         }
      }).then((payload) => {
         const replyListenerId = bot.onReplyToMessage(payload.chat.id, payload.message_id, async (msg) => {
            bot.removeListener(replyListenerId)
            if (msg.text) {
               const content = `Вопрос: ${msg.text}`;
               await model.addMessage(msg.chat.id, msg.date)
               bot.sendMessage(process.env.CHAT_ID, content,)
               bot.sendMessage(chatId, "Они скоро вам ответят", {
                  reply_markup: JSON.stringify({
                     keyboard:
                        [
                           [
                              {
                                 text: "Задайте вопрос"
                              }
                           ]
                        ],
                     resize_keyboard: true
                  })
               })
            }
         })
      })
   }
})

bot.on('message', async (msg) => {

   if (msg.chat.type == 'group') {
      let date = msg.reply_to_message.date
      const foundMsg = await model.foundMsg(date)
      bot.sendMessage(foundMsg.chat_id, `Javob: ${msg.text}`)
   }
});

bot.onText(/\/reply/, (msg) => {
   const chatId = msg.chat.id;

   const repliedMessageId = msg.reply_to_message.message_id;

   bot.sendMessage(chatId, 'Replying to the bot message', {
      reply_to_message_id: repliedMessageId
   });
});

app.get('/telegrambot', async (req, res) => {
   try {
      return res.send("OK")
   } catch (e) {
      console.log(e)
   }
})

const options = {
   definition: {
      openapi: "3.0.0",
      info: {
         title: "Qiblah API documentation",
         version: "1.0.0",
         description: "by Diyor Jaxongirov",
      },
      servers: [
         {
            url: "https://server.qiblah.app/api/v1",
         },
      ],
   },
   apis: ["./src/modules/index.js"],
};

const specs = swaggerJsDoc(options);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));


app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(path.resolve(__dirname, 'public')))
app.use('/files', express.static(path.resolve(__dirname, 'files')))
app.use("/api/v1", router);
const io = socket.initializeSocket(server);

server.listen(PORT, () => {
   console.log(`Server running on port ${PORT}`);
});