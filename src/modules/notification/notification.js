require('dotenv').config();
const model = require('./model');
const axios = require('axios');

module.exports = {
   SEND: async (req, res) => {
      try {
         const { user_id, title, message, notification_id } = req.body;
         const foundUser = await model.foundUser(user_id);

         const notification = {
            app_id: process.env.ONESIGNAL_APP_ID,
            headings: { "en": title },
            contents: { "en": message },
            include_player_ids: [`${foundUser.user_notification_id ? foundUser.user_notification_id : notification_id ? notification_id : ""}`]
         };

         const headers = {
            "Content-Type": "application/json",
            "Authorization": `Basic ${process.env.ONESIGNAL_API_KEY}`
         };

         const response = await axios.post('https://onesignal.com/api/v1/notifications', notification, { headers });

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

      } catch (error) {
         console.log(error);
         return res.status(500).json({
            status: 500,
            message: "Internal Server Error"
         });
      }
   }
};
