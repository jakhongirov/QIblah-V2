const model = require('./model')

module.exports = {
   GET: async (req, res) => {
      try {
         const { limit, page, user_id } = req.query

         if (limit && page) {
            const getList = await model.getList(limit, page, user_id)

            return res.status(200).json({
               status: 200,
               message: "Success",
               data: getList
            })
         } else {
            return res.status(400).json({
               status: 400,
               message: "Must write limit and page"
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