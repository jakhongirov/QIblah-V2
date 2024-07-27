const model = require('./model');
const axios = require('axios');
require('dotenv').config();

module.exports = {
   SEND: async (req, res) => {
      try {
         const { user_id, title, message, notification_id } = req.body;
         const foundUser = await model.foundUser(user_id);

         const playerId = foundUser?.user_notification_id || notification_id;

         if (!playerId) {
            return res.status(400).json({
               status: 400,
               message: "No valid player ID provided"
            });
         }

         const notification = {
            app_id: process.env.ONESIGNAL_APP_ID,
            headings: { "en": title },
            contents: { "en": message },
            include_player_ids: [playerId]
         };

         const headers = {
            "Content-Type": "application/json",
            "Authorization": `Basic ${process.env.ONESIGNAL_API_KEY}`
         };

         const response = await axios.post('https://onesignal.com/api/v1/notifications', notification, { headers });
         console.log(response.data);

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
         console.error('Error response from OneSignal:', error.response ? error.response.data : error.message);
         return res.status(500).json({
            status: 500,
            message: "Internal Server Error"
         });
      }
   }
};
