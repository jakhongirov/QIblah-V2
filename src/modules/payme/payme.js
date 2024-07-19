require('dotenv').config();
const model = require('./model')

module.exports = {
   PAYMENT: async (req, res) => {
      try {
         const { method, params, id } = req.body;
         console.log(req.body)

         if (method == "CheckPerformTransaction") {
            const foundUser = await model.foundUser(params?.id)
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