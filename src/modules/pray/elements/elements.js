const model = require('./model')
const path = require('path')
const FS = require('../../../lib/fs/fs')

module.exports = {
   GET: async (req, res) => {
      try {
         const { sub_category_id } = req.query

         if (sub_category_id) {
            const elementsBySubCategoryId = await model.elements(sub_category_id)

            if (elementsBySubCategoryId?.length) {
               return res.status(200).json({
                  status: 200,
                  message: "Success",
                  data: elementsBySubCategoryId
               })
            } else {
               return res.status(404).json({
                  status: 404,
                  message: "Not found"
               })
            }

         } else {
            const elements = await model.elements()

            if (elements?.length) {
               return res.status(200).json({
                  status: 200,
                  message: "Success",
                  data: elements
               })
            } else {
               return res.status(404).json({
                  status: 404,
                  message: "Not found"
               })
            }
         }

      } catch (error) {
         console.log(error);
         res.status(500).json({
            status: 500,
            message: "Interval Server Error"
         })
      }
   },

   GET_BY_ID: async (req, res) => {
      try {
         const { id } = req.params
         const foundElement = await model.foundElement(id)

         if (foundElement) {
            let zam_suras = null

            if (foundElement?.zam_suras == 1) {
               zam_suras = await model.zam_suras()
            }

            const duo_1 = foundElement?.duo_1 ? await model.foundDuo(foundElement?.duo_1) : null
            const duo_2 = foundElement?.duo_2 ? await model.foundDuo(foundElement?.duo_2) : null
            const duo_3 = foundElement?.duo_3 ? await model.foundDuo(foundElement?.duo_3) : null

            return res.status(200).json({
               status: 200,
               message: "Success",
               elements: foundElement,
               zam_suras: zam_suras,
               duo_1: duo_1,
               duo_2: duo_2,
               duo_3: duo_3
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

   ADD_FILE: async (req, res) => {
      try {
         const data = new FS(path.resolve(__dirname, '..', '..', '..', '..', 'files', `elements.json`))
         const file = JSON.parse(data.read())

         for (const item of file) {
            console.log(item?.title)

            await model.addElementFile(
               item?.id,
               item?.title,
               item?.text1,
               item?.text2,
               item?.zamSuras,
               item?.duo1,
               item?.duo2,
               item?.duo3,
               item?.subCategoryID,
               item?.image_audio ? item?.image_audio : "",
               item?.image_audio ? item?.image_audio?.split('https://srvr.qiblah.app/public/images/') : "",
               item?.image ? item?.image : "",
               item?.image ? item?.image?.split('https://srvr.qiblah.app/public/images/') : "",
            )
         }

         console.log("stop")

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

   ADD_ELEMENTS: async (req, res) => {
      try {
         const uploadFiles = req.files;
         const {
            title,
            text_1,
            text_2,
            zam_suras,
            duo_1,
            duo_2,
            duo_3,
            sub_category_id
         } = req.body

         const audioUrl = `${process.env.BACKEND_URL}/${uploadFiles?.audio[0]?.filename}`;
         const audioName = uploadFiles?.audio[0]?.filename;
         const imgUrl = `${process.env.BACKEND_URL}/${uploadFiles?.icon[0]?.filename}`;
         const imgName = uploadFiles?.icon[0]?.filename;

         const addElement = await model.addElement(
            title,
            text_1,
            text_2,
            zam_suras,
            duo_1,
            duo_2,
            duo_3,
            sub_category_id,
            audioUrl,
            audioName,
            imgUrl,
            imgName
         )

         if (addElement) {
            return res.status(200).json({
               status: 200,
               message: "Success",
               data: addElement
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

   EDIT_ELEMENT: async (req, res) => {
      try {
         const uploadFiles = req.files;
         const {
            id,
            title,
            text_1,
            text_2,
            zam_suras,
            duo_1,
            duo_2,
            duo_3,
            sub_category_id
         } = req.body
         const foundElement = await model.foundElement(id)
         let audioUrl = '';
         let audioName = '';
         let imgUrl = '';
         let imgName = '';

         if (foundElement) {
            if (uploadFiles?.audio) {
               if (foundElement?.audio_name) {
                  const deleteOldAvatar = new FS(path.resolve(__dirname, '..', '..', '..', '..', 'public', 'images', `${foundElement?.audio_name}`))
                  deleteOldAvatar.delete()
               }
               audioUrl = `${process.env.BACKEND_URL}/${uploadFiles?.audio[0]?.filename}`;
               audioName = uploadFiles?.audio[0]?.filename;
            } else {
               audioUrl = foundElement?.audio_link;
               audioName = foundElement?.audio_name;
            }

            if (uploadFiles?.icon) {
               if (foundElement?.image_name) {
                  const deleteOldAvatar = new FS(path.resolve(__dirname, '..', '..', '..', '..', 'public', 'images', `${foundElement?.image_name}`))
                  deleteOldAvatar.delete()
               }
               imgUrl = `${process.env.BACKEND_URL}/${uploadFiles?.icon[0]?.filename}`;
               imgName = uploadFiles?.icon[0]?.filename;
            } else {
               imgUrl = foundElement?.audio_link;
               imgName = foundElement?.image_name;
            }

            const editElement = await model.editElement(
               id,
               title,
               text_1,
               text_2,
               zam_suras,
               duo_1,
               duo_2,
               duo_3,
               sub_category_id,
               audioUrl,
               audioName,
               imgUrl,
               imgName
            )

            if (editElement) {
               return res.status(200).json({
                  status: 200,
                  message: "Success",
                  data: editElement
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

   DELETE_ELEMENT: async (req, res) => {
      try {
         const { id } = req.body
         const foundElement = await model.foundElement(id)

         if (foundElement) {
            const deleteElement = await model.deleteElement(id)

            if (deleteElement) {
               if (foundElement?.audio_name) {
                  const deleteOldAvatar = new FS(path.resolve(__dirname, '..', '..', '..', '..', 'public', 'images', `${foundElement?.audio_name}`))
                  deleteOldAvatar.delete()
               }

               if (foundElement?.image_name) {
                  const deleteOldAvatar = new FS(path.resolve(__dirname, '..', '..', '..', '..', 'public', 'images', `${foundElement?.image_name}`))
                  deleteOldAvatar.delete()
               }

               return res.status(200).json({
                  status: 200,
                  message: "Success",
                  data: deleteElement
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