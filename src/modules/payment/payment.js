const model = require('./model')

module.exports = {
   GET: async (req, res) => {
      try {
         const categories = await model.categories()

         if (categories?.length > 0) {
            return res.status(200).json({
               status: 200,
               message: "Success",
               data: categories
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
         const { category_name, month } = req.body

         const addCategory = await model.addCategory(category_name, month)

         if (addCategory) {
            return res.status(200).json({
               status: 200,
               message: "Succcess",
               data: addCategory
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
         const { id, category_name, month } = req.body

         const updateCategory = await model.updateCategory(
            id,
            category_name,
            month
         )

         if (updateCategory) {
            return res.status(200).json({
               status: 200,
               message: "Succcess",
               data: updateCategory
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

         const deleteCategory = await model.deleteCategory(id)

         if (deleteCategory) {
            return res.status(200).json({
               status: 200,
               message: "Succcess",
               data: deleteCategory
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