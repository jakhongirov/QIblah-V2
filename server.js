require('dotenv').config()
const express = require("express");
const http = require('http');
const cors = require("cors");
const path = require('path')
const fs = require('fs');
const app = express();
const server = http.createServer(app);
const {
   PORT
} = require("./src/config");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const router = require("./src/modules");
const socket = require('./src/lib/socket')
const TelegramBot = require('node-telegram-bot-api')
const bcryptjs = require('bcryptjs')
const model = require('./model')
const rateLimit = require('express-rate-limit');

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
});

const user = {};

bot.onText(/\/start ?(.*)?/, async (msg, match) => {
   const chatId = msg.chat.id;
   const param = match[1]?.trim();
   const username = msg.from.first_name;
   const foundUserChatId = await model.foundUserChatId(chatId)

   if (param) {
      if (Number.isInteger(Number(param))) {
         const content = `Assalomu alaykum, ${username}, iltimos bot tilni tanlang:\n\nЗдравствуйте, ${username}, пожалуйста выберите язык бота:`;

         bot.sendMessage(chatId, content, {
            reply_markup: {
               keyboard: [
                  [{
                     text: "O\'zbekcha"
                  },
                  {
                     text: "Русский"
                  },
                  ]
               ],
               resize_keyboard: true
            }
         }).then(async () => {
            if (foundUserChatId) {
               await model.editStep(chatId, 'start')
            } else {
               await model.addChatId(param, chatId)
               await model.editStep(chatId, 'start')
            }
         })
      } else if (typeof param === "string") {

         if (!user[chatId]) {
            user[chatId] = {
               parameter: null,
            };
         }

         const foundUser = await model.foundUser(param);

         if (foundUser) {
            user[chatId] = foundUser;
            user[chatId].parameter = param;

            const content = `Assalomu alaykum, ${foundUser?.user_name}, iltimos bot tilni tanlang:\n\nЗдравствуйте, ${foundUser?.user_name}, пожалуйста выберите язык бота:`;

            bot.sendMessage(chatId, content, {
               reply_markup: {
                  keyboard: [
                     [{
                        text: "O\'zbekcha"
                     }, {
                        text: "Русский"
                     }]
                  ],
                  resize_keyboard: true
               }
            }).then(async () => {
               if (foundUserChatId) {
                  await model.editStep(chatId, 'register')
               } else {
                  await model.addChatId(foundUser?.user_id, chatId)
                  await model.editStep(chatId, 'register')
               }
            });

         } else {
            const content = `Assalomu alaykum, ${username}, Siz ro'yxatdan o'ta olmadiz. Qayta urinib ko'ring.\nЗдравствуйте ${username}, Вы не смогли зарегистрироваться, Повторите попытку `;

            bot.sendMessage(chatId, content, {
               reply_markup: {
                  keyboard: [
                     [{
                        text: "O\'zbekcha"
                     }, {
                        text: "Русский"
                     }]
                  ],
                  resize_keyboard: true
               }
            }).then(async () => {
               if (foundUserChatId) {
                  await model.editStep(chatId, 'start')
               }
            });
         }

      }
   } else {
      const content = `Assalomu alaykum, ${username}, iltimos bot tilni tanlang:\n\nЗдравствуйте, ${username}, пожалуйста выберите язык бота:`;

      bot.sendMessage(chatId, content, {
         reply_markup: {
            keyboard: [
               [{
                  text: "O\'zbekcha"
               },
               {
                  text: "Русский"
               },
               ]
            ],
            resize_keyboard: true
         }
      }).then(async () => {
         if (foundUserChatId) {
            await model.editStep(chatId, 'start')
         }
      })
   }
})

bot.on('message', async (msg) => {
   const chatId = msg.chat.id;
   const text = msg.text;
   const foundUserChatId = await model.foundUserChatId(chatId)

   if (text == "O\'zbekcha" && foundUserChatId?.bot_step == 'register') {
      bot.sendMessage(chatId, `Iltimos, Ro'yxatdan o'tishni yakunlash uchun Kontaktingizni yuboring 🔽`, {
         reply_markup: {
            keyboard: [
               [{
                  text: 'Kontaktni yuborish',
                  request_contact: true
               }]
            ],
            resize_keyboard: true,
            one_time_keyboard: true
         }
      }).then(async () => {
         await model.editStep(chatId, 'register_contact_uz')
      })
   } else if (text == "O\'zbekcha" || foundUserChatId?.bot_step == 'start') {
      bot.sendMessage(chatId, 'Iltimos, kerakli menyuni tanlang:', {
         reply_markup: {
            keyboard: [
               [{
                  text: "Murojaat qilish"
               }, {
                  text: "Parolni tiklash"
               }]
            ],
            resize_keyboard: true
         }
      }).then(async () => {
         await model.editStep(chatId, 'menu_uz')
      });
   } else if (text == "Русский" && foundUserChatId?.bot_step == 'register') {
      bot.sendMessage(chatId, `Пожалуйста, отправьте свой контакт для завершения регистрации 🔽`, {
         reply_markup: {
            keyboard: [
               [{
                  text: 'Отправить контакт',
                  request_contact: true
               }]
            ],
            resize_keyboard: true,
            one_time_keyboard: true
         }
      }).then(async () => {
         await model.editStep(chatId, 'register_contact_ru')
      })
   } else if (text == "Русский" || foundUserChatId?.bot_step == 'start') {
      bot.sendMessage(chatId, 'Пожалуйста, выберите необходимое меню:', {
         reply_markup: {
            keyboard: [
               [{
                  text: "Задавать вопрос"
               }, {
                  text: "Восстановление пароля"
               }]
            ],
            resize_keyboard: true
         }
      }).then(async () => {
         await model.editStep(chatId, 'menu_ru')
      });
   } else if (text == 'Murojaat qilish') {
      bot.sendMessage(chatId, "Marhamat, murojaatingizni yozing:").then(async () => {
         await model.editStep(chatId, 'question_uz')
      })
   } else if (text == 'Задавать вопрос') {
      bot.sendMessage(chatId, "Пожалуйста, напишите ваш запрос:").then(async () => {
         await model.editStep(chatId, 'question_ru')
      })
   } else if (foundUserChatId?.bot_step == 'question_uz') {
      let content;

      if (text) {
         content = `Savol: ${msg.text}\n\n${msg.from.first_name} ${msg.from?.last_name ? msg.from?.last_name : ""} - ${msg.from?.username ? `@${msg.from?.username}` : ""} - ${msg.from?.language_code ? msg.from?.language_code : ""} -  ${msg.from?.id ? `#${msg.from?.id}` : ""}\nUser_id = ${foundUserChatId?.user_id}  bot_lang = Uzbek`
         await model.addMessage(chatId, msg.date);
         await bot.sendMessage(process.env.CHAT_ID, content);
      } else if (msg.photo) {
         const fileId = msg.photo[msg.photo.length - 1].file_id; // Get the highest resolution photo
         const caption = msg.caption ? msg.caption : '';
         content = `Rasm yuborildi:\n\n${msg.from.first_name} ${msg.from?.last_name ? msg.from?.last_name : ""} - ${msg.from?.username ? `@${msg.from?.username}` : ""} - ${msg.from?.language_code ? msg.from?.language_code : ""} -  ${msg.from?.id ? `#${msg.from?.id}` : ""}\n\nIzoh: ${caption}\nUser_id = ${foundUserChatId?.user_id}  bot_lang = Uzbek`;
         await model.addMessage(chatId, msg.date);
         await bot.sendPhoto(process.env.CHAT_ID, fileId, {
            caption: content
         });
      } else if (msg.sticker) {
         const fileId = msg.sticker.file_id;
         content = `Stiker yuborildi:\n\n${msg.from.first_name} ${msg.from?.last_name ? msg.from?.last_name : ""} - ${msg.from?.username ? `@${msg.from?.username}` : ""} - ${msg.from?.language_code ? msg.from?.language_code : ""} -  ${msg.from?.id ? `#${msg.from?.id}` : ""}\nUser_id = ${foundUserChatId?.user_id}  bot_lang = Uzbek`;
         await model.addMessage(chatId, msg.date);
         await bot.sendSticker(process.env.CHAT_ID, fileId);
      }
   } else if (foundUserChatId?.bot_step == 'question_ru') {
      let content;

      if (text) {
         content = `Savol: ${msg.text}\n\n${msg.from.first_name} ${msg.from?.last_name ? msg.from?.last_name : ""} - ${msg.from?.username ? `@${msg.from?.username}` : ""} - ${msg.from?.language_code ? msg.from?.language_code : ""} -  ${msg.from?.id ? `#${msg.from?.id}` : ""}\nUser_id = ${foundUserChatId?.user_id}  bot_lang = Russian`
         await model.addMessage(chatId, msg.date);
         await bot.sendMessage(process.env.CHAT_ID, content);
      } else if (msg.photo) {
         const fileId = msg.photo[msg.photo.length - 1].file_id; // Get the highest resolution photo
         const caption = msg.caption ? msg.caption : '';
         content = `Rasm yuborildi:\n\n${msg.from.first_name} ${msg.from?.last_name ? msg.from?.last_name : ""} - ${msg.from?.username ? `@${msg.from?.username}` : ""} - ${msg.from?.language_code ? msg.from?.language_code : ""} -  ${msg.from?.id ? `#${msg.from?.id}` : ""}\n\nIzoh: ${caption}\nUser_id = ${foundUserChatId?.user_id}  bot_lang = Russian`;
         await model.addMessage(chatId, msg.date);
         await bot.sendPhoto(process.env.CHAT_ID, fileId, {
            caption: content
         });
      } else if (msg.sticker) {
         const fileId = msg.sticker.file_id;
         content = `Stiker yuborildi:\n\n${msg.from.first_name} ${msg.from?.last_name ? msg.from?.last_name : ""} - ${msg.from?.username ? `@${msg.from?.username}` : ""} - ${msg.from?.language_code ? msg.from?.language_code : ""} -  ${msg.from?.id ? `#${msg.from?.id}` : ""}\nUser_id = ${foundUserChatId?.user_id}  bot_lang = Russian`;
         await model.addMessage(chatId, msg.date);
         await bot.sendSticker(process.env.CHAT_ID, fileId);
      }
   } else if (text == "Parolni tiklash") {
      bot.sendMessage(chatId, "Iltimos, kontaktingizni yuboring:", {
         reply_markup: {
            keyboard: [
               [{
                  text: 'Kontaktni yuborish',
                  request_contact: true
               }]
            ],
            resize_keyboard: true,
            one_time_keyboard: true
         }
      }).then(async () => {
         await model.editStep(chatId, 'change_password_uz')
      })
   } else if (text == "Восстановление пароля") {
      bot.sendMessage(chatId, "IПожалуйста, пришлите ваш контакт:", {
         reply_markup: {
            keyboard: [
               [{
                  text: 'Отправить контакт',
                  request_contact: true
               }]
            ],
            resize_keyboard: true,
            one_time_keyboard: true
         }
      }).then(async () => {
         await model.editStep(chatId, 'change_password_ru')
      })
   } else if (foundUserChatId?.bot_step == 'new_password_uz') {
      const pass_hash = await bcryptjs.hash(text, 10);
      const updatedUserPassword = await model.updatedUserPassword(foundUserChatId?.user_id, pass_hash)

      if (updatedUserPassword) {
         const content = `${updatedUserPassword?.user_name}, parolingiz muvaffaqiyatli o'zgartirildi.`
         bot.sendMessage(chatId, content, {
            reply_markup: {
               keyboard: [
                  [{
                     text: "Murojaat qilish"
                  }, {
                     text: "Parolni tiklash"
                  }]
               ],
               resize_keyboard: true
            }
         }).then(async () => {
            await model.editStep(chatId, 'menu_uz')
         })
      }
   } else if (foundUserChatId?.bot_step == 'new_password_ru') {
      const pass_hash = await bcryptjs.hash(text, 10);
      const updatedUserPassword = await model.updatedUserPassword(foundUserChatId?.user_id, pass_hash)

      if (updatedUserPassword) {
         const content = `${updatedUserPassword?.user_name}, Ваш пароль был успешно изменен.`
         bot.sendMessage(chatId, content, {
            reply_markup: {
               keyboard: [
                  [{
                     text: "Задавать вопрос"
                  }, {
                     text: "Восстановление пароля"
                  }]
               ],
               resize_keyboard: true
            }
         }).then(async () => {
            await model.editStep(chatId, 'menu_ru')
         })
      }

   } else if (msg.chat.type !== 'group' && !text?.startsWith('/start')) {
      if (text) {
         content = `Savol: ${msg.text}\n\n${msg.from.first_name} ${msg.from?.last_name ? msg.from?.last_name : ""} - ${msg.from?.username ? `@${msg.from?.username}` : ""} - ${msg.from?.language_code ? msg.from?.language_code : ""} -  ${msg.from?.id ? `#${msg.from?.id}` : ""}\nUser_id = ${foundUserChatId?.user_id}`
         await model.addMessage(msg.chat.id, msg.date);
         await bot.sendMessage(process.env.CHAT_ID, content);
      } else if (msg.photo) {
         const fileId = msg.photo[msg.photo.length - 1].file_id; // Get the highest resolution photo
         const caption = msg.caption ? msg.caption : '';
         content = `Rasm yuborildi:\n\n${msg.from.first_name} ${msg.from?.last_name ? msg.from?.last_name : ""} - ${msg.from?.username ? `@${msg.from?.username}` : ""} - ${msg.from?.language_code ? msg.from?.language_code : ""} -  ${msg.from?.id ? `#${msg.from?.id}` : ""}\n\nIzoh: ${caption}\nUser_id = ${foundUserChatId?.user_id}`;
         await model.addMessage(msg.chat.id, msg.date);
         await bot.sendPhoto(process.env.CHAT_ID, fileId, {
            caption: content
         });
      } else if (msg.sticker) {
         const fileId = msg.sticker.file_id;
         content = `Stiker yuborildi:\n\n${msg.from.first_name} ${msg.from?.last_name ? msg.from?.last_name : ""} - ${msg.from?.username ? `@${msg.from?.username}` : ""} - ${msg.from?.language_code ? msg.from?.language_code : ""} -  ${msg.from?.id ? `#${msg.from?.id}` : ""}\nUser_id = ${foundUserChatId?.user_id}`;
         await model.addMessage(msg.chat.id, msg.date);
         await bot.sendSticker(process.env.CHAT_ID, fileId);
      }
   }
})

bot.on('contact', async (msg) => {
   const chatId = msg.chat.id;
   const foundUserChatId = await model.foundUserChatId(chatId)

   if (msg.contact) {
      let phoneNumber = msg.contact.phone_number;

      if (msg.contact.user_id == msg.from.id) {

         if (!phoneNumber.startsWith('+')) {
            phoneNumber = `+${phoneNumber}`;
         }

         if (foundUserChatId?.bot_step == 'register_contact_uz') {

            const checkUser = {}
            checkUser[chatId] = await model.checkUser(phoneNumber)

            if (checkUser[chatId]) {

               if (checkUser[chatId]?.user_premium) {

                  const expirationDate = new Date(checkUser[chatId]?.user_premium_expires_at);
                  const today = new Date();
                  const isExpired = expirationDate < today;

                  if (isExpired) {
                     console.log("The check user's premium membership has expired.");

                     const addToken = await model.addToken(
                        checkUser[chatId].user_id,
                        user[chatId]?.parameter,
                        !checkUser[chatId]?.user_premium,
                        checkUser[chatId]?.user_premium_expires_at,
                        checkUser[chatId]?.payment_type,
                        user[chatId]?.user_country_code,
                        user[chatId]?.user_region,
                        user[chatId]?.user_location,
                        user[chatId]?.user_address_name,
                        user[chatId]?.user_location_status || 0,
                        user[chatId]?.tracking
                     )

                     if (addToken) {
                        const deleteUser = await model.deleteUser(user[chatId].user_id)
                        console.log("delete", deleteUser)
                        await model.addChatId(addToken.user_id, chatId)

                        bot.sendMessage(chatId, `Sizning so'rovingiz muvaffaqiyatli qabul qilindi, ilovaga qayting.`, {
                           reply_markup: {
                              keyboard: [
                                 [{
                                    text: "Murojaat qilish"
                                 }, {
                                    text: "Parolni tiklash"
                                 }]
                              ],
                              resize_keyboard: true
                           }
                        }).then(async () => {
                           await model.editStep(chatId, 'menu_uz')
                        });
                     }
                  } else {
                     console.log("The check user's premium membership is still valid.");
                     console.log(checkUser[chatId]?.user_premium)

                     const addToken = await model.addToken(
                        checkUser[chatId].user_id,
                        user[chatId]?.parameter,
                        checkUser[chatId]?.user_premium,
                        checkUser[chatId]?.user_premium_expires_at,
                        checkUser[chatId]?.payment_type,
                        user[chatId]?.user_country_code,
                        user[chatId]?.user_region,
                        user[chatId]?.user_location,
                        user[chatId]?.user_address_name,
                        user[chatId]?.user_location_status || 0,
                        user[chatId]?.tracking
                     )

                     if (addToken) {
                        const deleteUser = await model.deleteUser(user[chatId].user_id)
                        console.log("delete", deleteUser)
                        console.log("add", addToken)

                        await model.addChatId(addToken.user_id, chatId)

                        bot.sendMessage(chatId, `Sizning so'rovingiz muvaffaqiyatli qabul qilindi, ilovaga qayting.`, {
                           reply_markup: {
                              keyboard: [
                                 [{
                                    text: "Murojaat qilish"
                                 }, {
                                    text: "Parolni tiklash"
                                 }]
                              ],
                              resize_keyboard: true
                           }
                        }).then(async () => {
                           await model.editStep(chatId, 'menu_uz')
                        });
                     }
                  }
               } else if (user[chatId]?.user_premium) {
                  console.log("user premium")

                  const expirationDate = new Date(user[chatId]?.user_premium_expires_at);
                  const today = new Date();
                  const isExpired = expirationDate < today;

                  if (isExpired) {
                     console.log("The user's premium membership has expired.");

                     const addToken = await model.addToken(
                        checkUser[chatId].user_id,
                        user[chatId]?.parameter,
                        !user[chatId]?.user_premium,
                        user[chatId]?.user_premium_expires_at,
                        user[chatId]?.payment_type,
                        user[chatId]?.user_country_code,
                        user[chatId]?.user_region,
                        user[chatId]?.user_location,
                        user[chatId]?.user_address_name,
                        user[chatId]?.user_location_status || 0,
                        user[chatId]?.tracking
                     )

                     if (addToken) {
                        const deleteUser = await model.deleteUser(user[chatId].user_id)
                        console.log("delete", deleteUser)

                        await model.addChatId(addToken.user_id, chatId)

                        bot.sendMessage(chatId, `Sizning so'rovingiz muvaffaqiyatli qabul qilindi, ilovaga qayting.`, {
                           reply_markup: {
                              keyboard: [
                                 [{
                                    text: "Murojaat qilish"
                                 }, {
                                    text: "Parolni tiklash"
                                 }]
                              ],
                              resize_keyboard: true
                           }
                        }).then(async () => {
                           await model.editStep(chatId, 'menu_uz')
                        });
                     }

                  } else {
                     console.log("The user's premium membership is still valid.");
                     const addToken = await model.addToken(
                        checkUser[chatId].user_id,
                        user[chatId]?.parameter,
                        user[chatId]?.user_premium,
                        user[chatId]?.user_premium_expires_at,
                        user[chatId]?.payment_type,
                        user[chatId]?.user_country_code,
                        user[chatId]?.user_region,
                        user[chatId]?.user_location,
                        user[chatId]?.user_address_name,
                        user[chatId]?.user_location_status || 0,
                        user[chatId]?.tracking
                     )

                     if (addToken) {
                        const deleteUser = await model.deleteUser(user[chatId].user_id)
                        console.log("delete", deleteUser)

                        await model.addChatId(addToken.user_id, chatId)

                        bot.sendMessage(chatId, `Sizning so'rovingiz muvaffaqiyatli qabul qilindi, ilovaga qayting.`, {
                           reply_markup: {
                              keyboard: [
                                 [{
                                    text: "Murojaat qilish"
                                 }, {
                                    text: "Parolni tiklash"
                                 }]
                              ],
                              resize_keyboard: true
                           }
                        }).then(async () => {
                           await model.editStep(chatId, 'menu_uz')
                        });
                     }
                  }
               } else {
                  console.log("users not premium")
                  const addToken = await model.addToken(
                     checkUser[chatId].user_id,
                     user[chatId]?.parameter,
                     user[chatId]?.user_premium,
                     user[chatId]?.user_premium_expires_at,
                     user[chatId]?.payment_type,
                     user[chatId]?.user_country_code,
                     user[chatId]?.user_region,
                     user[chatId]?.user_location,
                     user[chatId]?.user_address_name,
                     user[chatId]?.user_location_status || 0,
                     user[chatId]?.tracking
                  )

                  if (addToken) {
                     const deleteUser = await model.deleteUser(user[chatId]?.user_id)
                     console.log("delete", deleteUser)

                     await model.addChatId(addToken.user_id, chatId)

                     bot.sendMessage(chatId, `Sizning so'rovingiz muvaffaqiyatli qabul qilindi, ilovaga qayting.`, {
                        reply_markup: {
                           keyboard: [
                              [{
                                 text: "Murojaat qilish"
                              }, {
                                 text: "Parolni tiklash"
                              }]
                           ],
                           resize_keyboard: true
                        }
                     }).then(async () => {
                        await model.editStep(chatId, 'menu_uz')
                     });
                  }
               }

            } else {
               const updatedUserPhone = await model.updatedUserPhone(user[chatId]?.user_id, phoneNumber);
               console.log("update", updatedUserPhone)
               console.log("update user", user[chatId])

               if (updatedUserPhone) {
                  bot.sendMessage(chatId, `Sizning so'rovingiz muvaffaqiyatli qabul qilindi, ilovaga qayting.`, {
                     reply_markup: {
                        keyboard: [
                           [{
                              text: "Murojaat qilish"
                           }, {
                              text: "Parolni tiklash"
                           }]
                        ],
                        resize_keyboard: true
                     }
                  }).then(async () => {
                     await model.editStep(chatId, 'menu_uz')
                  });
               }
            }

         } else if (foundUserChatId?.bot_step == "register_contact_ru") {

            const checkUser = {}
            checkUser[chatId] = await model.checkUser(phoneNumber)

            if (checkUser[chatId]) {

               if (checkUser[chatId]?.user_premium) {

                  const expirationDate = new Date(checkUser[chatId]?.user_premium_expires_at);
                  const today = new Date();
                  const isExpired = expirationDate < today;

                  if (isExpired) {
                     console.log("The check user's premium membership has expired.");

                     const addToken = await model.addToken(
                        checkUser[chatId].user_id,
                        user[chatId]?.parameter,
                        !checkUser[chatId]?.user_premium,
                        checkUser[chatId]?.user_premium_expires_at,
                        checkUser[chatId]?.payment_type,
                        user[chatId]?.user_country_code,
                        user[chatId]?.user_region,
                        user[chatId]?.user_location,
                        user[chatId]?.user_address_name,
                        user[chatId]?.user_location_status,
                        user[chatId]?.tracking
                     )

                     if (addToken) {
                        const deleteUser = await model.deleteUser(user[chatId].user_id)
                        console.log("delete", deleteUser)
                        await model.addChatId(addToken.user_id, chatId)

                        bot.sendMessage(chatId, `Ваш запрос успешно получен, вернитесь к приложению.`, {
                           reply_markup: {
                              keyboard: [
                                 [{
                                    text: "Задавать вопрос"
                                 }, {
                                    text: "Восстановление пароля"
                                 }]
                              ],
                              resize_keyboard: true
                           }
                        }).then(async () => {
                           await model.editStep(chatId, 'menu_ru')
                        });
                     }
                  } else {
                     console.log("The check user's premium membership is still valid.");
                     console.log(checkUser[chatId]?.user_premium)

                     const addToken = await model.addToken(
                        checkUser[chatId].user_id,
                        user[chatId]?.parameter,
                        checkUser[chatId]?.user_premium,
                        checkUser[chatId]?.user_premium_expires_at,
                        checkUser[chatId]?.payment_type,
                        user[chatId]?.user_country_code,
                        user[chatId]?.user_region,
                        user[chatId]?.user_location,
                        user[chatId]?.user_address_name,
                        user[chatId]?.user_location_status,
                        user[chatId]?.tracking
                     )

                     if (addToken) {
                        const deleteUser = await model.deleteUser(user[chatId].user_id)
                        console.log("delete", deleteUser)
                        console.log("add", addToken)

                        await model.addChatId(addToken.user_id, chatId)

                        bot.sendMessage(chatId, `Ваш запрос успешно получен, вернитесь к приложению.`, {
                           reply_markup: {
                              keyboard: [
                                 [{
                                    text: "Задавать вопрос"
                                 }, {
                                    text: "Восстановление пароля"
                                 }]
                              ],
                              resize_keyboard: true
                           }
                        }).then(async () => {
                           await model.editStep(chatId, 'menu_ru')
                        });
                     }
                  }
               } else if (user[chatId]?.user_premium) {
                  console.log("user premium")

                  const expirationDate = new Date(user[chatId]?.user_premium_expires_at);
                  const today = new Date();
                  const isExpired = expirationDate < today;

                  if (isExpired) {
                     console.log("The user's premium membership has expired.");

                     const addToken = await model.addToken(
                        checkUser[chatId].user_id,
                        user[chatId]?.parameter,
                        !user[chatId]?.user_premium,
                        user[chatId]?.user_premium_expires_at,
                        user[chatId]?.payment_type,
                        user[chatId]?.user_country_code,
                        user[chatId]?.user_region,
                        user[chatId]?.user_location,
                        user[chatId]?.user_address_name,
                        user[chatId]?.user_location_status,
                        user[chatId]?.tracking
                     )

                     if (addToken) {
                        const deleteUser = await model.deleteUser(user[chatId].user_id)
                        console.log("delete", deleteUser)

                        await model.addChatId(addToken.user_id, chatId)

                        bot.sendMessage(chatId, `Ваш запрос успешно получен, вернитесь к приложению.`, {
                           reply_markup: {
                              keyboard: [
                                 [{
                                    text: "Задавать вопрос"
                                 }, {
                                    text: "Восстановление пароля"
                                 }]
                              ],
                              resize_keyboard: true
                           }
                        }).then(async () => {
                           await model.editStep(chatId, 'menu_ru')
                        });
                     }

                  } else {
                     console.log("The user's premium membership is still valid.");
                     const addToken = await model.addToken(
                        checkUser[chatId].user_id,
                        user[chatId]?.parameter,
                        user[chatId]?.user_premium,
                        user[chatId]?.user_premium_expires_at,
                        user[chatId]?.payment_type,
                        user[chatId]?.user_country_code,
                        user[chatId]?.user_region,
                        user[chatId]?.user_location,
                        user[chatId]?.user_address_name,
                        user[chatId]?.user_location_status,
                        user[chatId]?.tracking
                     )

                     if (addToken) {
                        const deleteUser = await model.deleteUser(user[chatId].user_id)
                        console.log("delete", deleteUser)

                        await model.addChatId(addToken.user_id, chatId)

                        bot.sendMessage(chatId, `Ваш запрос успешно получен, вернитесь к приложению.`, {
                           reply_markup: {
                              keyboard: [
                                 [{
                                    text: "Задавать вопрос"
                                 }, {
                                    text: "Восстановление пароля"
                                 }]
                              ],
                              resize_keyboard: true
                           }
                        }).then(async () => {
                           await model.editStep(chatId, 'menu_ru')
                        });
                     }
                  }
               } else {
                  console.log("users not premium")
                  const addToken = await model.addToken(
                     checkUser[chatId].user_id,
                     user[chatId]?.parameter,
                     user[chatId]?.user_premium,
                     user[chatId]?.user_premium_expires_at,
                     user[chatId]?.payment_type,
                     user[chatId]?.user_country_code,
                     user[chatId]?.user_region,
                     user[chatId]?.user_location,
                     user[chatId]?.user_address_name,
                     user[chatId]?.user_location_status,
                     user[chatId]?.tracking
                  )

                  if (addToken) {
                     const deleteUser = await model.deleteUser(user[chatId]?.user_id)
                     console.log("delete", deleteUser)

                     await model.addChatId(addToken.user_id, chatId)

                     bot.sendMessage(chatId, `Ваш запрос успешно получен, вернитесь к приложению.`, {
                        reply_markup: {
                           keyboard: [
                              [{
                                 text: "Задавать вопрос"
                              }, {
                                 text: "Восстановление пароля"
                              }]
                           ],
                           resize_keyboard: true
                        }
                     }).then(async () => {
                        await model.editStep(chatId, 'menu_ru')
                     });
                  }
               }

            } else {
               const updatedUserPhone = await model.updatedUserPhone(user[chatId]?.user_id, phoneNumber);
               console.log(updatedUserPhone)

               if (updatedUserPhone) {
                  bot.sendMessage(chatId, `Ваш запрос успешно получен, вернитесь к приложению.`, {
                     reply_markup: {
                        keyboard: [
                           [{
                              text: "Задавать вопрос"
                           }, {
                              text: "Восстановление пароля"
                           }]
                        ],
                        resize_keyboard: true
                     }
                  }).then(async () => {
                     await model.editStep(chatId, 'menu_ru')
                  });
               }
            }
         } else if (foundUserChatId?.bot_step == 'change_password_uz') {
            const checkUser = await model.checkUser(phoneNumber)

            if (checkUser) {
               await model.addChatId(checkUser?.user_id, chatId)

               bot.sendMessage(chatId, 'Yangi parolingizni yozing').then(async () => {
                  await model.editStep(chatId, 'new_password_uz')
               });

            } else {
               bot.sendMessage(chatId, `Foydalanuvchi topilmadi`, {
                  reply_markup: {
                     keyboard: [
                        [{
                           text: "Murojaat qilish"
                        }, {
                           text: "Parolni tiklash"
                        }]
                     ],
                     resize_keyboard: true
                  }
               }).then(async () => {
                  await model.editStep(chatId, 'menu_uz')
               });
            }
         } else if (foundUserChatId?.bot_step == 'change_password_ru') {
            const checkUser = await model.checkUser(phoneNumber)

            if (checkUser) {
               await model.addChatId(checkUser?.user_id, chatId)

               bot.sendMessage(chatId, 'Введите новый пароль').then(async () => {
                  await model.editStep(chatId, 'new_password_ru')
               });
            } else {
               bot.sendMessage(chatId, `Пользователь не найден`, {
                  reply_markup: {
                     keyboard: [
                        [{
                           text: "Задавать вопрос"
                        }, {
                           text: "Восстановление пароля"
                        }]
                     ],
                     resize_keyboard: true
                  }
               }).then(async () => {
                  await model.editStep(chatId, 'menu_ru')
               });
            }
         }
      } else {
         return bot.sendMessage(msg.chat.id, "Kontakt noto'g'ri\n\nКонтакт неверный.", {
            reply_markup: {
               keyboard: [
                  [{
                     text: "Kontaktni yuborish (Отправить контакт)",
                     request_contact: true
                  }]
               ],
               resize_keyboard: true,
               one_time_keyboard: true
            }
         })
      }
   }
})

bot.on('message', async (msg) => {
   if (msg.chat.type === 'group' && msg.reply_to_message) {
      const date = msg.reply_to_message.date;
      console.log('date', date)
      const foundMsg = await model.foundMsg(date);
      console.log("bot", foundMsg)

      let content;
      if (msg.text) {
         content = `${msg.text}`;
         await bot.sendMessage(foundMsg?.chat_id, content).catch((error) => {
            if (error.response && error.response.statusCode === 403) {
               bot.sendMessage(process.env.CHAT_ID, `This user blocked bot`)
            } else {
               console.error('Error sending message:', error.message);
            }
         });
      } else if (msg.photo) {
         const fileId = msg.photo[msg.photo.length - 1].file_id; // Get the highest resolution photo
         const caption = msg.caption ? msg.caption : '';
         content = `${caption}`
         await bot.sendPhoto(foundMsg?.chat_id, fileId, {
            caption: content
         }).catch((error) => {
            if (error.response && error.response.statusCode === 403) {
               bot.sendMessage(process.env.CHAT_ID, `This user blocked bot`)
            } else {
               console.error('Error sending message:', error.message);
            }
         });;
      } else if (msg.sticker) {
         const fileId = msg.sticker.file_id;
         await bot.sendSticker(foundMsg?.chat_id, fileId).catch((error) => {
            if (error.response && error.response.statusCode === 403) {
               bot.sendMessage(process.env.CHAT_ID, `This user blocked bot`)
            } else {
               console.error('Error sending message:', error.message);
            }
         });;
      }

      // bot.sendMessage(foundMsg?.chat_id, `Javob: ${msg.text}`).catch((error) => {
      //    if (error.response && error.response.statusCode === 403) {
      //       bot.sendMessage(process.env.CHAT_ID, `This user blocked bot`)
      //    } else {
      //       console.error('Error sending message:', error.message);
      //    }
      // });
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
      servers: [{
         url: "https://srvr.qiblah.app/api/v1",
      },],
   },
   apis: ["./src/modules/index.js"],
};

const apiLimiter = rateLimit({
   windowMs: 1 * 1000, // 1 minutes
   max: 10, // limit each IP to 50 requests per windowMs
   message: 'Too many requests from this IP, please try again later.'
});

const specs = swaggerJsDoc(options);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
``
app.use(cors({
   origin: "*"
}));
app.use(express.json());
app.use(express.urlencoded({
   extended: true
}));
app.use('/public', express.static(path.resolve(__dirname, 'public')))
app.use('/files', express.static(path.resolve(__dirname, 'files')))
app.use("/api/v1/user/register/temporaryuser", apiLimiter);
app.use("/api/v1/user/token/:token", apiLimiter);
app.use("/api/v1", router);

const io = socket.initializeSocket(server);

server.listen(PORT, () => {
   console.log(`Server running on port ${PORT}`);
});