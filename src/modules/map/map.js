const model = require('./model')

module.exports = {
   GET_LIST: async (req, res) => {
      try {
         const getList = await model.getList()

         if (getList?.length > 0) {
            return res.status(200).json({
               status: 200,
               message: "Success",
               data: getList
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

   GET_RANDOM: async (req, res) => {
      try {
         const { type } = req.query
         const getRandom = await model.getRandom(type)

         if (getRandom) {
            return res.status(200).json({
               status: 200,
               message: "Success",
               data: getRandom
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

   ADD_KEY: async (req, res) => {
      try {
         const { key, type } = req.body

         const addKey = await model.addKey(key, type)

         if (addKey) {
            return res.status(200).json({
               status: 200,
               message: "Success",
               data: addKey
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

   DELETE_KEY: async (req, res) => {
      try {
         const { id } = req.body

         const deleteKey = await model.deleteKey(id)

         if (deleteKey) {
            return res.status(200).json({
               status: 200,
               message: "Success",
               data: deleteKey
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