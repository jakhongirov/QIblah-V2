const model = require('./model')

module.exports = {
   GET: async (req, res) => {
      try {
         const { user_id } = req.params
         const foundUser = await model.foundUser(user_id)

         if (foundUser) {
            if (foundUser?.user_country_code?.toLowerCase() == "uz") {
               return res.status(200).json({
                  status: 200,
                  message: "Success",
                  data: {
                     click: `https://my.click.uz/services/pay?merchant_id=26420&service_id=34442&transaction_param=Qiblah&additional_param3=${foundUser?.user_id}`,
                     uzum: ""
                  }
               })
            } else {
               return res.status(200).json({
                  status: 200,
                  message: "ok"
               })
            }
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