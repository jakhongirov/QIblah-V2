const model = require('./model')

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
         console.log(authHeader)
         console.log(req.body)

         if (isBase64(authHeader)) {
            let [username, password] = atob(authHeader).split(':');

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
                        account: {
                           value: params?.account
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
         console.log(authHeader)
         console.log(req.body)

         if (isBase64(authHeader)) {
            let [username, password] = atob(authHeader).split(':');

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
                  return res.status(200).json({
                     serviceId: serviceId,
                     transId: transId,
                     status: "CREATED",
                     transTime: time,
                     data: {
                        account: {
                           value: params?.account
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
         console.log(authHeader)
         console.log(req.body)

         if (isBase64(authHeader)) {
            let [username, password] = atob(authHeader).split(':');

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
                  return res.status(200).json({
                     serviceId: serviceId,
                     transId: transId,
                     status: "CONFIRMED",
                     confirmTime: time,
                     amount: 5000
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
         console.log(authHeader)
         console.log(req.body)

         if (isBase64(authHeader)) {
            let [username, password] = atob(authHeader).split(':');

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
                     amount: 5000
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
         console.log(authHeader)
         console.log(req.body)

         if (isBase64(authHeader)) {
            let [username, password] = atob(authHeader).split(':');

            if (username == "+998998887123" || password == "a12345") {
               const time = Date.now();
               console.log(time);

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
                     reverseTime: null,
                     amount: 5000
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