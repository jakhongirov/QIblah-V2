const model = require('./model');
const axios = require('axios');

module.exports = {
   SEND: async (req, res) => {
      try {
         const { use_id, title, message } = req.body;
         const foundUser = await model.foundUser(use_id);

         if (foundUser) {
            axios.post('https://onesignal.com/api/v1/notifications', {
               app_id: 'd0dd527d-8c4c-4936-bf4a-37e844b13a66',
               headings: { "en": title },
               contents: { "en": message },
               include_player_ids: [foundUser.user_notification_id]
            }, {
               headers: {
                  "Content-Type": "application/json",
                  "Authorization": "Basic NmQ2ODQxOGItMjg5Yi00ZDEwLWIzN2QtODc0MmY2ZDAwNzBj"
               }
            })
               .then(response => {
                  if (response.data.id) {
                     return res.status(200).json({
                        status: 200,
                        message: "Sent"
                     });
                  } else {
                     return res.status(400).json({
                        status: 400,
                        message: "Bad request"
                     });
                  }
               })
               .catch(error => {
                  console.log(error);
                  return res.status(500).json({
                     status: 500,
                     message: "Internal Server Error"
                  });
               });
         } else {
            return res.status(404).json({
               status: 404,
               message: "Not found"
            });
         }

      } catch (error) {
         console.log(error);
         res.status(500).json({
            status: 500,
            message: "Internal Server Error"
         });
      }
   }
};
