const model = require('./model')

module.exports = {
   GET: async (req, res) => {
      try {
         const { limit, page } = req.query

         if (limit && page) {
            const questionsList = await model.questionsList(limit, page)

            if (questionsList) {
               return res.status(200).json({
                  status: 200,
                  message: "Success",
                  data: questionsList
               })
            } else {
               return res.status(404).json({
                  status: 404,
                  message: "Not found"
               })
            }

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

   GET_CATEGORY: async (req, res) => {
      try {
         const { limit, page } = req.query
         const { categoryId } = req.params

         if (categoryId) {
            const questionsByCategories = await model.questionsByCategories(categoryId, limit, page)

            if (questionsByCategories) {
               return res.status(200).json({
                  status: 200,
                  message: "Success",
                  data: questionsByCategories
               })
            } else {
               return res.status(404).json({
                  status: 404,
                  message: "Not found"
               })
            }

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

   GET_ID: async (req, res) => {
      try {
         const { id } = req.params

         if (id) {
            const foundQuestion = await model.foundQuestion(id)

            if (foundQuestion) {
               return res.status(200).json({
                  status: 200,
                  message: "Success",
                  data: foundQuestion
               })
            } else {
               return res.status(404).json({
                  status: 404,
                  message: "Not found"
               })
            }

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

   ADD_QUESTION: async (req, res) => {
      try {
         const {
            question_title,
            question,
            answer,
            source,
            category_id
         } = req.body
         const addQuestion = await model.addQuestion(
            question_title,
            question,
            answer,
            source,
            category_id
         )

         if (addQuestion) {
            return res.status(201).json({
               status: 201,
               message: "Created",
               data: addQuestion
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

   EDIT_QUESTION: async (req, res) => {
      try {
         const {
            question_id,
            question_title,
            question,
            answer,
            source,
            category_id
         } = req.body
         const editQuestion = await model.editQuestion(
            question_id,
            question_title,
            question,
            answer,
            source,
            category_id
         )

         if (editQuestion) {
            return res.status(200).json({
               status: 200,
               message: "Success",
               data: editQuestion
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

   DELETE_QUESTION: async (req, res) => {
      try {
         const { question_id } = req.body

         if (question_id) {
            const deleteQuestion = await model.deleteQuestion(question_id)

            if (deleteQuestion) {
               return res.status(200).json({
                  status: 200,
                  message: "Success",
                  data: deleteQuestion
               })
            } else {
               return res.status(400).json({
                  status: 400,
                  message: "Bad request"
               })
            }

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