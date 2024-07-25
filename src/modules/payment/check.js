const model = require('./model')

module.exports = {
   GET: async (req, res) => {
      try {
         const { user_id } = req.params
         const foundUser = await model.foundUser(user_id)

         if (foundUser) {
            const checkOs = foundUser?.user_os?.includes('2')

            if (foundUser?.user_country_code?.toLowerCase() == "uz" && !checkOs) {
               return res.status(200).json({
                  status: 200,
                  message: "Success",
                  data: {
                     click: `https://my.click.uz/services/pay?merchant_id=26420&service_id=34442&transaction_param=Qiblah&additional_param3=${foundUser?.user_id}`,
                     uzum: `https://www.uzumbank.uz/open-service?serviceId=498617211&ilova=Qiblah&id=${foundUser?.user_id}`,
                     payme: `https://checkout.paycom.uz/m=6694e9a630c39cf3ab6659df;ac.user_id=${foundUser?.user_id};ac.ilova=Qiblah;`
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