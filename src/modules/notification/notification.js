const model = require('./model')
const fetch = require('node-fetch')

module.exports = {
   SEND: async (req, res) => {
      try {
         const { use_id, title, message } = req.body
         const foundUser = await model.foundUser(use_id)

         if (foundUser) {
            fetch('https://onesignal.com/api/v1/notifications', {
               method: "POST",
               headers: {
                  "Content-Type": "application/json",
                  "Authorization": "Basic NmQ2ODQxOGItMjg5Yi00ZDEwLWIzN2QtODc0MmY2ZDAwNzBj"
               },
               body: JSON.stringify(
                  {
                     app_id: 'd0dd527d-8c4c-4936-bf4a-37e844b13a66',
                     headings: { "en": title },
                     contents: { "en": message },
                     include_player_ids: [foundUser.user_notification_id]
                  }
               )
            })
               .then(res => res.json())
               .then(data => {
                  if (data.id) {
                     return res.status(200).json({
                        status: 200,
                        message: "Sent"
                     })
                  } else {
                     return res.status(400).json({
                        status: 400,
                        message: "Bad request"
                     })
                  }
               })
               .catch((e) => console.log(e))
         } else {
            return res.status(404).json({
               status: 404,
               message: "Not found"
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