require('dotenv').config();
const model = require('./model')
const path = require('path')
const FS = require('../../lib/fs/fs')

module.exports = {
   GET: async (req, res) => {
      try {
         const { limit, page } = req.query

         if (limit && page) {
            const photos = await model.photos(limit, page)

            if (photos) {
               return res.status(200).json({
                  status: 200,
                  message: "Success",
                  data: photos
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
               message: "Bad request, write query limit and page"
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

   ADD_PHOTO: async (req, res) => {
      try {
         const uploadPhoto = req.file;
         const imgUrl = uploadPhoto ? `${process.env.BACKEND_URL}/${uploadPhoto?.filename}` : null;
         const imgName = uploadPhoto ? uploadPhoto?.filename : null;

         const addPhoto = await model.addPhoto(imgUrl, imgName)

         if (addPhoto) {
            return res.status(201).json({
               status: 201,
               message: "Created",
               data: addPhoto
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

   DELETE_PHOTO: async (req, res) => {
      try {
         const { id } = req.body

         const deletePhoto = await model.deletePhoto(id)

         if (deletePhoto) {

            if (deletePhoto?.image_name) {
               const deleteOldAvatar = new FS(path.resolve(__dirname, '..', '..', '..', 'public', 'images', `${deletePhoto?.image_name}`))
               deleteOldAvatar.delete()
            }

            return res.status(200).json({
               status: 200,
               message: "Success",
               data: deletePhoto
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