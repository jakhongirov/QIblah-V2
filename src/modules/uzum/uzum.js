const model = require('./model')
const { bot } = require('../../lib/bot')
const axios = require("axios")

// let stringToEncode = "uzum:bank";

// Encode the string to Base64
// let encodedString = btoa(stringToEncode);

function isBase64(str) {
   try {
      return btoa(atob(str)) === str;
   } catch (err) {
      return false;
   }
}

const checkDateDifference = (date, last_date) => {
   const dbDateTime = new Date(last_date);
   const differenceInMilliseconds = Number(date) - dbDateTime;
   const differenceInHours = differenceInMilliseconds / (1000 * 60 * 60);

   return differenceInHours;
};

module.exports = {
   CHECK: async (req, res) => {
      try {
         const {
            serviceId,
            timestamp,
            params,
            errorCode
         } = req.body

         const authHeader = req.headers['authorization'];
         const base64Credentials = authHeader.replace(/^Basic\s+/, '');
         console.log(authHeader)
         console.log(req.body)

         if (isBase64(base64Credentials)) {
            let [username, password] = atob(base64Credentials).split(':');

            if (username == "+998998887123" || password == "a12345") {
               const time = Date.now();
               console.log(time);


               if (errorCode == 10007) {
                  return res.status(400).json({
                     serviceId: serviceId,
                     timestamp: time,
                     status: "FAILED",
                     errorCode: "10007"
                  })
               } else {

                  return res.status(200).json({
                     serviceId: serviceId,
                     timestamp: time,
                     status: "OK",
                     data: {
                        id: {
                           value: params?.id
                        },
                        tarif: {
                           value: params?.tarif
                        },
                        ilova: {
                           value: params?.ilova
                        }
                     }
                  })
               }


            } else {
               return res.status(401).json({
                  status: 401
               })
            }

         } else {
            res.status(401).json({
               status: 401
            })
         }

      } catch (error) {
         console.log(error);
         res.status(500).json({
            status: 500,
            message: "Interval Server Error"
         })
      }
   },

   CREATE: async (req, res) => {
      try {
         const {
            serviceId,
            timestamp,
            transId,
            params,
            amount,
            errorCode
         } = req.body

         const authHeader = req.headers['authorization'];
         const base64Credentials = authHeader.replace(/^Basic\s+/, '');
         console.log(authHeader)
         console.log("created", req.body)

         if (isBase64(base64Credentials)) {
            let [username, password] = atob(base64Credentials).split(':');

            if (username == "+998998887123" || password == "a12345") {
               const time = Date.now();
               console.log(time);

               if (errorCode == 10013) {

                  return res.status(400).json({
                     serviceId: serviceId,
                     transId: transId,
                     status: "FAILED",
                     transTime: time,
                     errorCode: "10013"
                  })
               } else {
                  const foundTransByUser = await model.foundTransByUser(params.id)

                  if (foundTransByUser) {
                     const differenceInHours = checkDateDifference(timestamp, foundTransByUser?.transaction_create_at)
                     console.log(differenceInHours)

                     if (differenceInHours >= 1) {
                        const foundUser = await model.foundUser(params.id)
                        const foundPayment = await model.foundPayment(params?.tarif);
                        const monthToAdd = Number(foundPayment?.month);

                        if (params.ilova == 'Xisobchi_AI') {
                           const response = await axios.get(`https://xisobchiai.admob.uz/api/v1/payment/check/${params.id}/${params?.tarif}/${amount}`);

                           if (response.status == 200) {
                              await model.addTransId(
                                 params.id,
                                 'XisobchiAi',
                                 transId,
                                 monthToAdd,
                                 amount,
                                 params.tarif,
                                 "created",
                                 params.ilova
                              )

                              return res.status(200).json({
                                 serviceId: serviceId,
                                 transId: transId,
                                 status: "CREATED",
                                 transTime: time,
                                 data: {
                                    id: {
                                       value: params?.id
                                    },
                                    tarif: {
                                       value: params?.tarif
                                    },
                                    ilova: {
                                       value: params?.ilova
                                    }
                                 },
                                 amount: amount
                              })

                           } else {
                              return res.status(400).json({
                                 serviceId: serviceId,
                                 transId: transId,
                                 status: "FAILED",
                                 transTime: time,
                                 errorCode: "99999"
                              })
                           }
                        }

                        await model.addTransId(
                           params.id,
                           foundUser?.user_token[foundUser?.user_token?.length - 1],
                           transId,
                           monthToAdd,
                           amount,
                           params.tarif,
                           "created",
                           params.ilova
                        )

                        return res.status(200).json({
                           serviceId: serviceId,
                           transId: transId,
                           status: "CREATED",
                           transTime: time,
                           data: {
                              id: {
                                 value: params?.id
                              },
                              tarif: {
                                 value: params?.tarif
                              },
                              ilova: {
                                 value: params?.ilova
                              }
                           },
                           amount: amount
                        })
                     } else {
                        return res.status(400).json({
                           serviceId: serviceId,
                           transId: transId,
                           status: "FAILED",
                           transTime: time,
                           errorCode: "99999"
                        })
                     }
                  } else {
                     const foundUser = await model.foundUser(params.id)
                     const foundPayment = await model.foundPayment(params?.tarif);
                     const monthToAdd = Number(foundPayment?.month);

                     if (params.ilova == 'Xisobchi_AI') {
                        const response = await axios.get(`https://xisobchiai.admob.uz/api/v1/payment/check/${params.id}/${params?.tarif}/${amount}`);

                        if (response.status == 200) {
                           await model.addTransId(
                              params.id,
                              'XisobchiAi',
                              transId,
                              monthToAdd,
                              amount,
                              params.tarif,
                              "created",
                              params.ilova
                           )

                           return res.status(200).json({
                              serviceId: serviceId,
                              transId: transId,
                              status: "CREATED",
                              transTime: time,
                              data: {
                                 id: {
                                    value: params?.id
                                 },
                                 tarif: {
                                    value: params?.tarif
                                 },
                                 ilova: {
                                    value: params?.ilova
                                 }
                              },
                              amount: amount
                           })

                        } else {
                           return res.status(400).json({
                              serviceId: serviceId,
                              transId: transId,
                              status: "FAILED",
                              transTime: time,
                              errorCode: "99999"
                           })
                        }
                     }

                     await model.addTransId(
                        params.id,
                        foundUser?.user_token[foundUser?.user_token?.length - 1],
                        transId,
                        monthToAdd,
                        amount,
                        params.tarif,
                        "created",
                        params.ilova
                     )

                     return res.status(200).json({
                        serviceId: serviceId,
                        transId: transId,
                        status: "CREATED",
                        transTime: time,
                        data: {
                           id: {
                              value: params?.id
                           },
                           tarif: {
                              value: params?.tarif
                           },
                           ilova: {
                              value: params?.ilova
                           }
                        },
                        amount: amount
                     })
                  }
               }
            } else {
               return res.status(401).json({
                  status: 401
               })
            }

         } else {
            res.status(401).json({
               status: 401
            })
         }

      } catch (error) {
         console.log(error);
         res.status(500).json({
            status: 500,
            message: "Interval Server Error"
         })
      }
   },

   CONFIRM: async (req, res) => {
      try {
         const {
            serviceId,
            timestamp,
            transId,
            paymentSource,
            tariff,
            errorCode
         } = req.body
         const authHeader = req.headers['authorization'];
         const base64Credentials = authHeader.replace(/^Basic\s+/, '');
         console.log(authHeader)
         console.log("confirm", req.body)

         if (isBase64(base64Credentials)) {
            let [username, password] = atob(base64Credentials).split(':');

            if (username == "+998998887123" || password == "a12345") {
               const time = Date.now();
               console.log(time);

               if (errorCode == 10014) {
                  return res.status(400).json({
                     serviceId: serviceId,
                     transId: transId,
                     status: "FAILED",
                     confirmTime: time,
                     errorCode: "10014"
                  })
               } else {
                  const foundTrans = await model.foundTrans(transId)

                  if (foundTrans?.ilova == 'Xisobchi_AI') {
                     const response = await axios.get(`https://xisobchiai.admob.uz/api/v1/payment/success/${foundTrans.user_id}/${foundTrans?.tarif}`);

                     if (response.status == 200) {
                        bot.sendMessage(634041736,
                           `<strong>Uzum:</strong>\n\nIlova:${foundTrans.ilova}\nUser id: ${foundTrans?.user_id}\nTarif: ${foundTrans?.tarif}\nAmount: ${foundTrans?.amount}\nDate: ${finalFormat}`,
                           { parse_mode: "HTML" }
                        );

                        return res.status(200).json({
                           serviceId: serviceId,
                           transId: transId,
                           status: "CONFIRMED",
                           confirmTime: time,
                        })

                     }
                  }

                  // const foundTrans = await model.foundTrans(transId)
                  const foundPayment = await model.foundPayment(foundTrans?.tarif);
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
                  let tracking = {};

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

                  tracking['tarif'] = foundPayment?.category_name
                  tracking['amount'] = foundTrans?.amount
                  tracking['trans_id'] = foundTrans?.trans_id
                  tracking['date'] = finalFormat
                  tracking['expire_date'] = formattedDate
                  tracking['type'] = "uzum"

                  const foundUser = await model.foundUser(foundTrans?.user_id)
                  await model.editUserPremium(foundUser?.user_token[Number(foundUser?.user_token?.length - 1)], formattedDate, "uzum", tracking)
                  await model.editTrans(foundTrans.id, "paid")

                  bot.sendMessage(634041736,
                     `<strong>Uzum:</strong>\n\nUser token:${foundUser?.user_token[foundUser?.user_token?.length - 1]}\nUser id: ${foundTrans?.user_id}\nTarif: ${foundPayment?.category_name}\nAmount: ${foundTrans?.amount}\nDate: ${finalFormat}`,
                     { parse_mode: "HTML" }
                  );

                  return res.status(200).json({
                     serviceId: serviceId,
                     transId: transId,
                     status: "CONFIRMED",
                     confirmTime: time,
                  })
               }

            } else {
               res.status(401).json({
                  status: 401
               })
            }

         } else {
            res.status(401).json({
               status: 401
            })
         }

      } catch (error) {
         console.log(error);
         res.status(500).json({
            status: 500,
            message: "Interval Server Error"
         })
      }
   },

   REVERSE: async (req, res) => {
      try {
         const {
            serviceId,
            timestamp,
            transId,
            errorCode
         } = req.body
         const authHeader = req.headers['authorization'];
         const base64Credentials = authHeader.replace(/^Basic\s+/, '');
         console.log(authHeader)
         console.log(req.body)

         if (isBase64(base64Credentials)) {
            let [username, password] = atob(base64Credentials).split(':');

            if (username == "+998998887123" || password == "a12345") {
               const time = Date.now();
               console.log(time);

               if (errorCode == 10017) {
                  return res.status(400).json({
                     serviceId: serviceId,
                     transId: transId,
                     status: "FAILED",
                     reverseTime: time,
                     errorCode: "10017"
                  })
               } else {
                  return res.status(200).json({
                     serviceId: serviceId,
                     transId: transId,
                     status: "REVERSED",
                     reverseTime: time,
                  })
               }

            } else {
               res.status(401).json({
                  status: 401
               })
            }

         } else {
            res.status(401).json({
               status: 401
            })
         }

      } catch (error) {
         console.log(error);
         res.status(500).json({
            status: 500,
            message: "Interval Server Error"
         })
      }
   },

   STATUS: async (req, res) => {
      try {
         const {
            serviceId,
            timestamp,
            transId,
            errorCode
         } = req.body

         const authHeader = req.headers['authorization'];
         const base64Credentials = authHeader.replace(/^Basic\s+/, '');
         console.log(authHeader)
         console.log("uzum status", req.body)

         if (isBase64(base64Credentials)) {
            let [username, password] = atob(base64Credentials).split(':');

            if (username == "+998998887123" || password == "a12345") {
               const time = Date.now();

               if (errorCode == 10014) {
                  return res.status(400).json({
                     serviceId: serviceId,
                     transId: transId,
                     status: "FAILED",
                     transTime: time,
                     confirmTime: time,
                     reverseTime: null,
                     errorCode: "10014"
                  })
               } else {
                  return res.status(200).json({
                     serviceId: serviceId,
                     transId: transId,
                     status: "CONFIRMED",
                     transTime: time,
                     confirmTime: time,
                     reverseTime: null
                  })
               }

            } else {
               res.status(401).json({
                  status: 401
               })
            }

         } else {
            res.status(401).json({
               status: 401
            })
         }

      } catch (error) {
         console.log(error);
         res.status(500).json({
            status: 500,
            message: "Interval Server Error"
         })
      }
   }
}