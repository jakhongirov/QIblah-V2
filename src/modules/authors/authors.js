require('dotenv').config();
const model = require('./model')
const path = require('path')
const FS = require('../../lib/fs/fs')

module.exports = {
   GET: async (req, res) => {
      try {
         const authorsList = await model.authorsList()

         if (authorsList) {
            return res.status(200).json({
               status: 200,
               message: "Success",
               data: authorsList
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

   ADD_AUTHOR: async (req, res) => {
      try {
         const uploadPhoto = req.file;
         const { author_name } = req.body

         const imgUrl = `${process.env.BACKEND_URL}/${uploadPhoto?.filename}`;
         const imgName = uploadPhoto?.filename;

         const addAuthor = await model.addAuthor(author_name, imgUrl, imgName)

         if (addAuthor) {
            return res.status(200).json({
               status: 200,
               message: "Success",
               data: addAuthor
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

   UPDATE_AUTHOR: async (req, res) => {
      try {
         const uploadPhoto = req.file;
         const { author_id, author_name } = req.body
         const foundAuthor = await model.foundAuthor(author_id)

         if (foundAuthor) {
            let imgUrl = '';
            let imgName = '';

            if (uploadPhoto) {
               if (foundAuthor?.author_image_name) {
                  const deleteOldAvatar = new FS(path.resolve(__dirname, '..', '..', '..', 'public', 'images', `${foundAuthor?.author_image_name}`))
                  deleteOldAvatar.delete()
               }
               imgUrl = `${process.env.BACKEND_URL}/${uploadPhoto?.filename}`;
               imgName = uploadPhoto?.filename;
            } else {
               imgUrl = foundAuthor?.author_image_url;
               imgName = foundAuthor?.author_image_name;
            }

            const updateAuthor = await model.updateAuthor(author_id, author_name, imgUrl, imgName)

            if (updateAuthor) {
               return res.status(200).json({
                  status: 200,
                  message: "Success",
                  data: updateAuthor
               })
            } else {
               return res.status(400).json({
                  status: 400,
                  message: "Bad request"
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
   },

   DELETE_AUTHOR: async (req, res) => {
      try {
         const { author_id } = req.body
         const foundAuthor = await model.foundAuthor(author_id)

         if (foundAuthor) {
            if (foundAuthor?.author_image_name) {
               const deleteOldAvatar = new FS(path.resolve(__dirname, '..', '..', '..', 'public', 'images', `${foundAuthor?.author_image_name}`))
               deleteOldAvatar.delete()
            }

            const deleteAuthor = await model.deleteAuthor(author_id)

            if (deleteAuthor) {
               return res.status(200).json({
                  status: 200,
                  message: "Success",
                  data: deleteAuthor
               })
            } else {
               return res.status(400).json({
                  status: 400,
                  message: "Bad request"
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