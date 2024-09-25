const model = require('./model')
const path = require('path')
const FS = require('../../../lib/fs/fs')

module.exports = {
   GET: async (req, res) => {
      try {
         const { lang_id } = req.query

         if (lang_id) {
            const duos = await model.duos(lang_id)

            if (duos?.length > 0) {
               return res.status(200).json({
                  status: 200,
                  message: "Success",
                  data: duos
               })
            } else {
               return res.status(404).json({
                  status: 404,
                  message: "Not found"
               })
            }
         } else {
            const duos = await model.duos()

            if (duos?.length > 0) {
               return res.status(200).json({
                  status: 200,
                  message: "Success",
                  data: duos
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

   ADD_FILE: async (req, res) => {
      try {
         const data = new FS(path.resolve(__dirname, '..', '..', '..', '..', 'files', `duolar.json`))
         const file = JSON.parse(data.read())

         for (const item of file) {
            console.log(item?.title)

            await model.addDuoFile(
               item?.id,
               item?.title,
               item?.text,
               item?.translate,
               item?.langID,
               item?.zam_sura,
               item?.audio ? item?.audio : '',
               item?.audio ? item?.audio?.split('https://srvr.qiblah.app/public/images/')[1] : '',
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

   ADD_DUO: async (req, res) => {
      try {
         const uploadPhoto = req.file;
         const {
            title,
            text,
            translation,
            lang_id,
            zam_sura
         } = req.body
         const audioUrl = `${process.env.BACKEND_URL}/${uploadPhoto?.filename}`;
         const audioName = uploadPhoto?.filename;

         const addDuo = await model.addDuo(
            title,
            text,
            translation,
            lang_id,
            zam_sura,
            audioUrl,
            audioName
         )

         if (addDuo) {
            return res.status(201).json({
               status: 201,
               message: "Created",
               data: addDuo
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

   EDIT_DUO: async (req, res) => {
      try {
         const uploadPhoto = req.file;
         const {
            id,
            title,
            text,
            translation,
            lang_id,
            zam_sura
         } = req.body
         const foundDuo = await model.foundDuo(id)

         if (foundDuo) {
            let audioUrl = '';
            let audioName = '';

            if (uploadPhoto) {
               if (foundDuo?.audio_name) {
                  const deleteOldAvatar = new FS(path.resolve(__dirname, '..', '..', '..', '..', 'public', 'images', `${foundDuo?.audio_name}`))
                  deleteOldAvatar.delete()
               }
               audioUrl = `${process.env.BACKEND_URL}/${uploadPhoto?.filename}`;
               audioName = uploadPhoto?.filename;
            } else {
               audioUrl = foundDuo?.audio_link;
               audioName = foundDuo?.audio_name;
            }

            const editDuo = await model.editDuo(
               id,
               title,
               text,
               translation,
               lang_id,
               zam_sura,
               audioUrl,
               audioName
            )

            if (editDuo) {
               return res.status(200).json({
                  status: 200,
                  message: "Success",
                  data: editDuo
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

   DELETE_DUO: async (req, res) => {
      try {
         const { id } = req.body
         const foundDuo = await model.foundDuo(id)

         if (foundDuo) {
            const deleteDuo = await model.deleteDuo(id)

            if (deleteDuo) {
               if (foundDuo?.audio_name) {
                  const deleteOldAvatar = new FS(path.resolve(__dirname, '..', '..', '..', '..', 'public', 'images', `${foundDuo?.audio_name}`))
                  deleteOldAvatar.delete()
               }

               return res.status(200).json({
                  status: 200,
                  message: "Success",
                  data: deleteDuo
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