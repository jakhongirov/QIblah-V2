const model = require('./model')

module.exports = {
   GET: async (req, res) => {
      try {
         const payment = await model.payment()

         if (payment?.length > 0) {
            return res.status(200).json({
               status: 200,
               message: "Success",
               data: payment
            })
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
   },

   POST: async (req, res) => {
      try {
         const { name, price } = req.body

         const addPayment = await model.addPayment(name, price)

         if (addPayment) {
            return res.status(200).json({
               status: 200,
               message: "Succcess",
               data: addPayment
            })
         } else {
            return res.status(400).json({
               status: 400,
               message: "Bad request"
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

   PUT: async (req, res) => {
      try {
         const { id, price } = req.body

         const editPayment = await model.editPayment(
            id,
            price
         )

         if (editPayment) {
            return res.status(200).json({
               status: 200,
               message: "Succcess",
               data: editPayment
            })
         } else {
            return res.status(400).json({
               status: 400,
               message: "Bad request"
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

   DELETE: async (req, res) => {
      try {
         const { id } = req.body

         const deletePayment = await model.deletePayment(id)

         if (deletePayment) {
            return res.status(200).json({
               status: 200,
               message: "Succcess",
               data: deletePayment
            })
         } else {
            return res.status(400).json({
               status: 400,
               message: "Bad request"
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