const model = require('./model')
const path = require('path')
const FS = require('../../lib/fs/fs')

module.exports = {
   GET: async (req, res) => {
      try {
         const { limit, page, category_id } = req.query

         if (limit && page) {
            if (category_id) {
               const zikrListByCategory = await model.zikrListByCategory(limit, page, category_id)

               if (zikrListByCategory) {
                  return res.status(200).json({
                     status: 200,
                     message: "Success",
                     data: zikrListByCategory
                  })
               } else {
                  return res.status(404).json({
                     status: 404,
                     message: "Not found"
                  })
               }
            } else {
               const zikrList = await model.zikrList(limit, page)

               if (zikrList) {
                  return res.status(200).json({
                     status: 200,
                     message: "Success",
                     data: zikrList
                  })
               } else {
                  return res.status(404).json({
                     status: 404,
                     message: "Not found"
                  })
               }
            }

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
   },

   GET_ID: async (req, res) => {
      try {
         const { id } = req.params

         if (id) {
            const foundZikr = await model.foundZikr(id)

            if (foundZikr) {
               return res.status(200).json({
                  status: 200,
                  message: "Success",
                  data: foundZikr
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
               message: "Send id"
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

   ADD_FILE: async (req, res) => {
      try {
         const data = new FS(path.resolve(__dirname, '..', '..', '..', 'files', `items.json`))
         const file = JSON.parse(data.read())

         for (const item of file) {
            await model.addZikr(
               item?.title,
               item?.description,
               item?.dailyGoal,
               item?.catID,
               item?.audioLink,
               item?.audioLink,
               item?.info,
            )
         }

         return res.status(200).json({
            status: 200,
            message: "Success"
         });

      } catch (error) {
         console.log(error);
         res.status(500).json({
            status: 500,
            message: "Interval Server Error"
         })
      }
   },

   ADD_ZIKR: async (req, res) => {
      try {
         const uploadPhoto = req.file;
         const {
            zikr_title,
            zikr_description,
            zikr_daily_count,
            category_id,
            zikr_info
         } = req.body
         const audioUrl = `${process.env.BACKEND_URL}/${uploadPhoto?.filename}`;
         const audioName = uploadPhoto?.filename;

         const addZikr = await model.addZikr(
            zikr_title,
            zikr_description,
            zikr_daily_count,
            category_id,
            audioUrl,
            audioName,
            zikr_info
         )

         if (addZikr) {
            return res.status(201).json({
               status: 201,
               message: "Created",
               data: addZikr
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

   EDIT_ZIKR: async (req, res) => {
      try {
         const uploadPhoto = req.file;
         const {
            zikr_id,
            zikr_title,
            zikr_description,
            zikr_daily_count,
            category_id,
            zikr_info
         } = req.body
         const foundZikr = await model.foundZikr(zikr_id)
         let audioUrl = '';
         let audioName = '';

         if (foundZikr) {

            if (uploadPhoto) {
               if (foundZikr?.zikr_audio_name) {
                  const deleteOldAvatar = new FS(path.resolve(__dirname, '..', '..', '..', 'public', 'images', `${foundZikr?.zikr_audio_name}`))
                  deleteOldAvatar.delete()
               }
               audioUrl = `${process.env.BACKEND_URL}/${uploadPhoto?.filename}`;
               audioName = uploadPhoto?.filename;
            } else {
               audioUrl = foundZikr?.zikr_audio_link;
               audioName = foundZikr?.zikr_audio_name;
            }

            const editZikr = await model.editZikr(
               zikr_id,
               zikr_title,
               zikr_description,
               zikr_daily_count,
               category_id,
               audioUrl,
               audioName,
               zikr_info
            )

            if (editZikr) {
               return res.status(200).json({
                  status: 200,
                  message: "Success",
                  data: editZikr
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

   DElETE_ZIKR: async (req, res) => {
      try {
         const { zikr_id } = req.body
         const foundZikr = await model.foundZikr(zikr_id)

         if (foundZikr) {

            if (foundZikr?.zikr_audio_name) {
               const deleteOldAvatar = new FS(path.resolve(__dirname, '..', '..', '..', 'public', 'images', `${foundZikr?.zikr_audio_name}`))
               deleteOldAvatar.delete()
            }

            const deleteZikr = await model.deleteZikr(zikr_id)

            if (deleteZikr) {
               return res.status(200).json({
                  status: 200,
                  message: "Success",
                  data: deleteZikr
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