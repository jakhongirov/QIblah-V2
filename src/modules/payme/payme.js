require('dotenv').config();
const model = require('./model')
const { bot } = require('../../lib/bot')
const axios = require('axios')

module.exports = {
   PAYMENT: async (req, res) => {
      try {
         const { method, params, id } = req.body;

         if (method == "CheckPerformTransaction") {
            console.log("CheckPerformTransaction", req.body)
            const foundUser = await model.foundUser(params?.account?.user_id)
            const foundPayment = await model.foundPayment(params?.account?.tarif)

            let { amount } = params;
            amount = Math.floor(amount / 100);

            if (params.account.ilova == 'Xisobchi_AI') {
               return res.status(200).json({
                  result: {
                     allow: true
                  }
               })
            }

            if (params.account.ilova == 'Hisobchi_AI') {
               return res.status(200).json({
                  result: {
                     allow: true
                  }
               })
            }

            if (params.account.ilova == 'TopKadr') {
               return res.status(200).json({
                  result: {
                     allow: true
                  }
               })
            }


            if (foundPayment && foundUser) {
               return res.status(200).json({
                  result: {
                     allow: true
                  }
               })
            } else {
               return res.json({
                  error: {
                     name: "UserNotFound",
                     code: -31099,
                     message: {
                        uz: "Biz sizning hisobingizni topolmadik.",
                        ru: "Мы не нашли вашу учетную запись",
                        en: "We couldn't find your account",
                     }
                  },
                  id: id
               })
            }
         } else if (method == "CreateTransaction") {
            console.log("CreateTransaction", req.body)

            let { amount } = params;
            amount = Math.floor(amount / 100);

            if (params.account.ilova == 'Xisobchi_AI') {
               const response = await axios.get(`https://xisobchiai.admob.uz/api/v1/payment/check/${params.account.user_id}/${params.account.tarif}/${amount}`);

               if (response.status == 200) {
                  const transaction = await model.foundTransaction(params.id);
                  if (transaction) {
                     if (transaction.state !== 1) {
                        return res.json({
                           error: {
                              name: "CantDoOperation",
                              code: -31008,
                              message: {
                                 uz: "Biz operatsiyani bajara olmaymiz",
                                 ru: "Мы не можем сделать операцию",
                                 en: "We can't do operation",
                              }
                           },
                           id: id
                        });
                     }

                     const currentTime = Date.now();
                     const expirationTime = (currentTime - transaction.create_time) / 60000 < 12; // 12m
                     if (!expirationTime) {
                        await model.updateTransaction(params.id, -1, 4,);
                        return res.json({
                           error: {
                              name: "CantDoOperation",
                              code: -31008,
                              message: {
                                 uz: "Biz operatsiyani bajara olmaymiz",
                                 ru: "Мы не можем сделать операцию",
                                 en: "We can't do operation",
                              },
                           },
                           id: id
                        });
                     }

                     return res.json({
                        result: {
                           create_time: Number(transaction.create_time),
                           transaction: transaction.id,
                           state: 1,
                        }
                     });
                  }

                  const newTransaction = await model.addTransaction(
                     params?.account?.user_id,
                     params?.account?.tarif,
                     1,
                     amount,
                     params.id,
                     params?.time,
                     'xisobchiAi',
                     params?.account?.ilova,
                  );

                  console.log(newTransaction)

                  return res.json({
                     result: {
                        transaction: newTransaction.id,
                        state: 1,
                        create_time: Number(newTransaction.create_time),
                        receivers: null
                     }
                  })


               } else {
                  return res.json({
                     error: {
                        name: "CantDoOperation",
                        code: -31008,
                        message: {
                           uz: "Biz operatsiyani bajara olmaymiz",
                           ru: "Мы не можем сделать операцию",
                           en: "We can't do operation",
                        }
                     },
                     id: id
                  });
               }
            }

            if (params.account.ilova == 'Hisobchi_AI') {
               const response = await axios.get(`https://xisobchiai2.admob.uz/api/v1/payment/check/${params.account.user_id}/${params.account.tarif}/${amount}`);

               if (response.status == 200) {
                  const transaction = await model.foundTransaction(params.id);
                  if (transaction) {
                     if (transaction.state !== 1) {
                        return res.json({
                           error: {
                              name: "CantDoOperation",
                              code: -31008,
                              message: {
                                 uz: "Biz operatsiyani bajara olmaymiz",
                                 ru: "Мы не можем сделать операцию",
                                 en: "We can't do operation",
                              }
                           },
                           id: id
                        });
                     }

                     const currentTime = Date.now();
                     const expirationTime = (currentTime - transaction.create_time) / 60000 < 12; // 12m
                     if (!expirationTime) {
                        await model.updateTransaction(params.id, -1, 4,);
                        return res.json({
                           error: {
                              name: "CantDoOperation",
                              code: -31008,
                              message: {
                                 uz: "Biz operatsiyani bajara olmaymiz",
                                 ru: "Мы не можем сделать операцию",
                                 en: "We can't do operation",
                              },
                           },
                           id: id
                        });
                     }

                     return res.json({
                        result: {
                           create_time: Number(transaction.create_time),
                           transaction: transaction.id,
                           state: 1,
                        }
                     });
                  }

                  const newTransaction = await model.addTransaction(
                     params?.account?.user_id,
                     params?.account?.tarif,
                     1,
                     amount,
                     params.id,
                     params?.time,
                     'hisobchiAi',
                     params?.account?.ilova,
                  );

                  console.log(newTransaction)

                  return res.json({
                     result: {
                        transaction: newTransaction.id,
                        state: 1,
                        create_time: Number(newTransaction.create_time),
                        receivers: null
                     }
                  })


               } else {
                  return res.json({
                     error: {
                        name: "CantDoOperation",
                        code: -31008,
                        message: {
                           uz: "Biz operatsiyani bajara olmaymiz",
                           ru: "Мы не можем сделать операцию",
                           en: "We can't do operation",
                        }
                     },
                     id: id
                  });
               }
            }

            if (params.account.ilova == 'TopKadr') {
               const response = await axios.get(``);

               if (response.status === 200) {
                  const transaction = await model.foundTransaction(params.id);
                  if (transaction) {
                     if (transaction.state !== 1) {
                        return res.json({
                           error: {
                              name: "CantDoOperation",
                              code: -31008,
                              message: {
                                 uz: "Biz operatsiyani bajara olmaymiz",
                                 ru: "Мы не можем сделать операцию",
                                 en: "We can't do operation",
                              }
                           },
                           id: id
                        });
                     }

                     const currentTime = Date.now();
                     const expirationTime = (currentTime - transaction.create_time) / 60000 < 12; // 12m
                     if (!expirationTime) {
                        await model.updateTransaction(params.id, -1, 4,);
                        return res.json({
                           error: {
                              name: "CantDoOperation",
                              code: -31008,
                              message: {
                                 uz: "Biz operatsiyani bajara olmaymiz",
                                 ru: "Мы не можем сделать операцию",
                                 en: "We can't do operation",
                              },
                           },
                           id: id
                        });
                     }

                     return res.json({
                        result: {
                           create_time: Number(transaction.create_time),
                           transaction: transaction.id,
                           state: 1,
                        }
                     });
                  }

                  const newTransaction = await model.addTransaction(
                     params?.account?.user_id,
                     params?.account?.tarif,
                     1,
                     amount,
                     params.id,
                     params?.time,
                     'xisobchiAi',
                     params?.account?.ilova,
                  );


               }
            }


            const transaction = await model.foundTransaction(params.id);
            const foundUser = await model.foundUser(params?.account?.user_id)
            if (transaction) {
               if (transaction.state !== 1) {
                  return res.json({
                     error: {
                        name: "CantDoOperation",
                        code: -31008,
                        message: {
                           uz: "Biz operatsiyani bajara olmaymiz",
                           ru: "Мы не можем сделать операцию",
                           en: "We can't do operation",
                        }
                     },
                     id: id
                  });
               }

               const currentTime = Date.now();
               const expirationTime = (currentTime - transaction.create_time) / 60000 < 12; // 12m
               if (!expirationTime) {
                  await model.updateTransaction(params.id, -1, 4,);
                  return res.json({
                     error: {
                        name: "CantDoOperation",
                        code: -31008,
                        message: {
                           uz: "Biz operatsiyani bajara olmaymiz",
                           ru: "Мы не можем сделать операцию",
                           en: "We can't do operation",
                        },
                     },
                     id: id
                  });
               }

               return res.json({
                  result: {
                     create_time: Number(transaction.create_time),
                     transaction: transaction.id,
                     state: 1,
                  }
               });
            }

            if (foundUser) {
               const newTransaction = await model.addTransaction(
                  params?.account?.user_id,
                  params?.account?.tarif,
                  1,
                  amount,
                  params.id,
                  params?.time,
                  foundUser?.user_token[foundUser?.user_token?.length - 1],
                  params?.account?.ilova,
               );

               console.log(newTransaction)

               return res.json({
                  result: {
                     transaction: newTransaction.id,
                     state: 1,
                     create_time: Number(newTransaction.create_time),
                     receivers: null
                  }
               })
            } else {
               return res.json({
                  error: {
                     name: "UserNotFound",
                     code: -31099,
                     message: {
                        uz: "Biz sizning hisobingizni topolmadik.",
                        ru: "Мы не нашли вашу учетную запись",
                        en: "We couldn't find your account",
                     }
                  },
                  id: id
               })
            }

         } else if (method == "PerformTransaction") {
            console.log("PerformTransaction", req.body)

            const currentTime = Date.now();
            const transaction = await model.foundTransaction(params.id);
            if (!transaction) {
               return res.json({
                  error: {
                     name: "TransactionNotFound",
                     code: -31003,
                     message: {
                        uz: "Tranzaktsiya topilmadi",
                        ru: "Транзакция не найдена",
                        en: "Transaction not found",
                     }
                  },
                  id: id
               })
            }

            if (transaction.state !== 1) {
               if (transaction.state !== 2) {
                  return res.json({
                     error: {
                        name: "CantDoOperation",
                        code: -31008,
                        message: {
                           uz: "Biz operatsiyani bajara olmaymiz",
                           ru: "Мы не можем сделать операцию",
                           en: "We can't do operation",
                        }
                     },
                     id: id
                  })
               }

               return res.json({
                  result: {
                     perform_time: Number(transaction.perform_time),
                     transaction: transaction.id,
                     state: 2,
                  }
               });
            }

            const expirationTime = (currentTime - Number(transaction.create_time)) / 60000 < 12;

            if (!expirationTime) {
               await model.updateTransactionPerform(
                  params.id,
                  -1,
                  4,
                  currentTime,
               );

               return res.json({
                  error: {
                     name: "CantDoOperation",
                     code: -31008,
                     message: {
                        uz: "Biz operatsiyani bajara olmaymiz",
                        ru: "Мы не можем сделать операцию",
                        en: "We can't do operation",
                     }
                  },
                  id: id
               })
            }

            await model.updateTransactionPaid(
               params.id,
               2,
               currentTime,
            );


            if (transaction.ilova == 'Xisobchi_AI') {
               const response = await axios.get(`https://xisobchiai.admob.uz/api/v1/payment/success/${transaction.user_id}/${transaction.payment}`);

               if (response.status == 200) {
                  bot.sendMessage(634041736,
                     `<strong>PayMe:</strong>\n\nIlova: ${transaction.ilova}\nUser id: ${transaction?.user_id}\nTarif: ${transaction.tarif}\nAmount: ${transaction?.amount}\nDate: ${finalFormat}`,
                     { parse_mode: "HTML" }
                  );

                  return res.json({
                     result: {
                        perform_time: Number(currentTime),
                        transaction: transaction.id,
                        state: 2,
                     }
                  })
               }

            }

            if (transaction.ilova == 'Hisobchi_AI') {
               const response = await axios.get(`https://xisobchiai2.admob.uz/api/v1/payment/success/${transaction.user_id}/${transaction.payment}/Payme/${transaction.transaction}/${transaction?.amount}`);

               if (response.status == 200) {
                  bot.sendMessage(634041736,
                     `<strong>PayMe:</strong>\n\nIlova: ${transaction.ilova}\nUser id: ${transaction?.user_id}\nTarif: ${transaction.tarif}\nAmount: ${transaction?.amount}\nDate: ${finalFormat}`,
                     { parse_mode: "HTML" }
                  );

                  return res.json({
                     result: {
                        perform_time: Number(currentTime),
                        transaction: transaction.id,
                        state: 2,
                     }
                  })
               }

            }

            const foundPayment = await model.foundPayment(transaction?.payment)
            const today = new Date();
            const expiresDate = new Date(today);
            const monthToAdd = Number(foundPayment?.month);
            let targetMonth = today.getMonth() + monthToAdd;
            let targetYear = today.getFullYear();

            while (targetMonth > 11) {
               targetMonth -= 12;
               targetYear++;
            }

            expiresDate.setFullYear(targetYear, targetMonth, 1);
            const maxDaysInTargetMonth = new Date(targetYear, targetMonth + 1, 0).getDate();
            expiresDate.setDate(Math.min(today.getDate(), maxDaysInTargetMonth));

            if (expiresDate < today) {
               expiresDate.setMonth(expiresDate.getMonth() + 1);
               expiresDate.setDate(0); // Set to the last day of the previous month
            }

            const formattedDate = expiresDate.toISOString();

            const options = {
               year: 'numeric',
               month: '2-digit',
               day: '2-digit',
               hour: '2-digit',
               minute: '2-digit',
               second: '2-digit',
               timeZone: 'Asia/Tashkent'
            };
            const formatter = new Intl.DateTimeFormat('en-GB', options);
            const formattedDate2 = formatter.format(today);

            // Replace the format to match the required "DD.MM.YYYY HH:MM:SS" format
            const [day, month, year] = formattedDate2.split(', ')[0].split('/');
            const time = formattedDate2.split(', ')[1];
            const finalFormat = `${day}.${month}.${year} ${time}`;

            const foundUser = await model.foundUser(transaction?.user_id);
            let tracking = {};

            tracking['tarif'] = foundPayment?.category_name
            tracking['amount'] = transaction?.amount
            tracking['trans_id'] = transaction?.transaction
            tracking['date'] = finalFormat
            tracking['expire_date'] = formattedDate
            tracking['type'] = "payme"

            const editUserPremium = await model.editUserPremium(foundUser?.user_token[foundUser?.user_token?.length - 1], formattedDate, "payme", tracking)

            if (editUserPremium) {

               bot.sendMessage(634041736,
                  `<strong>PayMe:</strong>\n\nUser token:${foundUser?.user_token[foundUser?.user_token?.length - 1]}\nUser id: ${transaction?.user_id}\nTarif: ${foundPayment?.category_name}\nAmount: ${transaction?.amount}\nDate: ${finalFormat}`,
                  { parse_mode: "HTML" }
               );

               return res.json({
                  result: {
                     perform_time: Number(currentTime),
                     transaction: transaction.id,
                     state: 2,
                  }
               })
            }

         } else if (method == "CancelTransaction") {
            console.log("CancelTransaction", req.body)

            const transaction = await model.foundTransaction(params.id);
            if (!transaction) {
               return res.json({
                  error: {
                     name: "TransactionNotFound",
                     code: -31003,
                     message: {
                        uz: "Tranzaktsiya topilmadi",
                        ru: "Транзакция не найдена",
                        en: "Transaction not found",
                     }
                  },
                  id: id
               })
            }

            const currentTime = Date.now();

            if (transaction.state > 0) {
               await model.updateTransactionState(
                  params.id,
                  -Math.abs(transaction.state),
                  params.reason,
                  currentTime,
               );
            }

            return res.json({
               result: {
                  cancel_time: Number(transaction.cancel_time) || Number(currentTime),
                  transaction: transaction.id,
                  state: -Math.abs(transaction.state),
               }
            })

         } else if (method == "CheckTransaction") {
            console.log("CheckTransaction", req.body)

            const transaction = await model.foundTransaction(params.id);
            if (!transaction) {
               return res.json({
                  error: {
                     name: "TransactionNotFound",
                     code: -31003,
                     message: {
                        uz: "Tranzaktsiya topilmadi",
                        ru: "Транзакция не найдена",
                        en: "Transaction not found",
                     },
                  },
                  id: id
               });
            }

            return res.status(200).json({
               result: {
                  create_time: transaction.create_time ? Number(transaction.create_time) : 0,
                  perform_time: transaction.perform_time ? Number(transaction.perform_time) : 0,
                  cancel_time: transaction.cancel_time ? Number(transaction.cancel_time) : 0,
                  transaction: transaction.id,
                  state: transaction.state,
                  reason: transaction.reason,
               }
            });
         }

      } catch (error) {
         console.log(error);
         res.status(500).json({
            status: 500,
            message: "Interval Server Error"
         })
      }
   },
}