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

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

let user;

bot.on('message', async (msg) => {
   const chatId = msg.chat.id;
   const text = msg.text;
   const username = msg.from.first_name;

   if (text?.startsWith('/start') && text?.split(' ').length > 1) {
      await handleStartCommand(msg, chatId, text, username);
   } else if (text == '/start') {
      const content = `Assalomu alaykum, ${username}, iltimos, tilni tanlang 🔽\nЗдравствуйте, ${username}, пожалуйста, выберите язык 🔽`;

      bot.sendMessage(chatId, content, {
         reply_markup: {
            keyboard: [
               [
                  {
                     text: "O\'zbekcha"
                  },
                  {
                     text: "Русский"
                  },
               ]
            ],
            resize_keyboard: true
         }
      });
   }
});

const handleStartCommand = async (msg, chatId, text, username) => {
   const parameter = text.split(' ')[1];

   try {
      const foundUser = await model.foundUser(parameter);
      user = foundUser;
      user["parameter"] = parameter;

      if (foundUser) {
         const content = `Assalomu alaykum, ${foundUser?.user_name}, iltimos, tilni tanlang 🔽\nЗдравствуйте, ${foundUser?.user_name}, пожалуйста, выберите язык 🔽`;

         bot.sendMessage(chatId, content, {
            reply_markup: {
               inline_keyboard: [
                  [{ text: 'O\'zbekcha', callback_data: 'uz' }, { text: 'Русский', callback_data: 'ru' }]
               ]
            }
         });
      } else {
         const content = `Assalomu alaykum, ${username}, Siz ro'yxatdan o'ta olmadiz. Qayta urinib ko'ring.\nЗдравствуйте ${username}, Вы не смогли зарегистрироваться, Повторите попытку `;

         bot.sendMessage(chatId, content, {
            reply_markup: {
               keyboard: [
                  [{ text: "O\'zbekcha" }, { text: "Русский" }]
               ],
               resize_keyboard: true
            }
         });
      }
   } catch (error) {
      console.error(`Error fetching user: ${error.message}`);
   }
};

bot.on("message", (msg) => {
   const chatId = msg.chat.id;
   const text = msg.text;

   if (text === "O'zbekcha") {
      bot.sendMessage(chatId, 'Iltimos, kerakli menyuni tanlang:', {
         reply_markup: {
            keyboard: [[{ text: "Murojaat qilish" }]],
            resize_keyboard: true
         }
      });
   } else if (text === 'Русский') {
      bot.sendMessage(chatId, 'Пожалуйста, выберите необходимое меню:', {
         reply_markup: {
            keyboard: [[{ text: "Задавать вопрос" }]],
            resize_keyboard: true
         }
      });
   } else if (text === 'Murojaat qilish' || text === 'Задавать вопрос') {
      const languagePrompt = text === 'Murojaat qilish' ? 'Marhamat, murojaatingizni yozing:' : 'Пожалуйста, напишите ваш запрос:';
      bot.sendMessage(chatId, languagePrompt, {
         reply_markup: { force_reply: true }
      }).then((payload) => {
         const replyListenerId = bot.onReplyToMessage(payload.chat.id, payload.message_id, async (msg) => {
            bot.removeListener(replyListenerId);
            if (msg.text) {
               const content = text === 'Murojaat qilish' ? `Savol: ${msg.text}\n\n${msg.from.first_name} ${msg.from?.last_name ? msg.from?.last_name : ""} - ${msg.from?.username ? `@${msg.from?.username}` : ""} - ${msg.from?.language_code ? msg.from?.language_code : ""} -  ${msg.from?.id ? `#${msg.from?.id}` : ""}` : `Вопрос: ${msg.text}\n\n${msg.from.first_name} ${msg.from?.last_name ? msg.from?.last_name : ""} - ${msg.from?.username ? `@${msg.from?.username}` : ""} - ${msg.from?.language_code ? msg.from?.language_code : ""} -  ${msg.from?.id ? `#${msg.from?.id}` : ""}`;
               await model.addMessage(msg.chat.id, msg.date);
               bot.sendMessage(process.env.CHAT_ID, content);
               bot.sendMessage(chatId, text === 'Murojaat qilish' ? "Tashakkur, tez orada sizga javob qaytaramiz!" : "Спасибо, мы скоро свяжемся с вами!", {
                  reply_markup: {
                     keyboard: [[{ text: text }]],
                     resize_keyboard: true
                  }
               });
            }
         });
      });
   }
});

bot.on('callback_query', async (msg) => {
   const chatId = msg.message.chat.id;
   const data = msg.data;

   if (data === 'uz' || data === 'ru') {
      await handleLanguageSelection(chatId, data);
   }
});

const handleLanguageSelection = async (chatId, language) => {
   const languageText = language === 'uz' ? `Iltimos, Ro'yxatdan o'tishni yakunlash uchun Kontaktingizni yuboring 🔽` : `Пожалуйста, отправьте свой контакт для завершения регистрации 🔽`;
   const buttonText = language === 'uz' ? 'Kontaktni yuborish' : 'Отправить контакт';

   bot.sendMessage(chatId, languageText, {
      reply_markup: {
         keyboard: [[{ text: buttonText, request_contact: true }]],
         resize_keyboard: true,
         one_time_keyboard: true
      }
   }).then(() => {
      const contactHandler = async (msg) => {
         if (msg.contact) {
            let phoneNumber = msg.contact.phone_number;
            if (!phoneNumber.startsWith('+')) {
               phoneNumber = `+${phoneNumber}`;
            }
            const checkUser = await model.checkUser(phoneNumber)

            if (checkUser) {
               const addToken = await model.addToken(checkUser.user_id, user?.parameter)

               if (addToken) {
                  await model.deleteOldUser(user.user_id)
                  bot.sendMessage(msg.chat.id, language === 'uz' ? `Siz Ro'yxatdan muvaffaqiyatli o'tdingiz. Endi Qiblah ilovasiga qaytishingiz mumkin ✅` : `Регистрация прошла успешно. Теперь вы можете вернуться в приложение Qiblah ✅`, {
                     reply_markup: {
                        keyboard: [
                           [{ text: language === 'uz' ? "Murojaat qilish" : "Задавать вопрос" }]
                        ],
                        resize_keyboard: true
                     }
                  });
                  bot.off('contact', contactHandler);
               }
            } else {
               const updatedUserPhone = await model.updatedUserPhone(user.user_id, phoneNumber);
               if (updatedUserPhone) {
                  bot.sendMessage(msg.chat.id, language === 'uz' ? `Sizning so'rovingiz muvaffaqiyatli qabul qilindi, ilovaga qayting.` : `Ваш запрос успешно получен, вернитесь к приложению.`, {
                     reply_markup: {
                        keyboard: [
                           [{ text: language === 'uz' ? "Murojaat qilish" : "Задавать вопрос" }]
                        ],
                        resize_keyboard: true
                     }
                  });
                  bot.off('contact', contactHandler); // Remove the listener after processing
               }
            }

         }
      };

      bot.on('contact', contactHandler);
   });
};


bot.on('message', async (msg) => {
   if (msg.chat.type === 'group' && msg.reply_to_message) {
      const date = msg.reply_to_message.date;
      const foundMsg = await model.foundMsg(date);
      bot.sendMessage(foundMsg?.chat_id, `Javob: ${msg.text}`).catch((error) => {
         if (error.response && error.response.statusCode === 403) {
            bot.sendMessage(process.env.CHAT_ID, `This user blocked bot`)
         } else {
            console.error('Error sending message:', error.message);
         }
      });
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
            url: "https://srvr.qiblah.app/api/v1",
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