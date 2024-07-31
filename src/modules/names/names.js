require('dotenv').config();
const model = require('./model')
const path = require('path')
const FS = require('../../lib/fs/fs')

module.exports = {
   GET: async (req, res) => {
      try {
         const { lang } = req.query
         const nameList = await model.nameList(lang)

         if (nameList) {
            return res.status(200).json({
               status: 200,
               message: "Success",
               data: nameList
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

   GET_ID: async (req, res) => {
      try {
         const { id } = req.params
         const { lang } = req.query

         if (id) {
            const foundName = await model.foundName(id, lang)

            if (foundName) {
               return res.status(200).json({
                  status: 200,
                  message: "Success",
                  data: foundName
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
               message: "Bad request, send name id"
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
         const data = new FS(path.resolve(__dirname, '..', '..', '..', 'files', `99names.json`))
         const file = JSON.parse(data.read())

         for (const item of file) {
            await model.editName(
               item?.id,
               item?.arabic,
               item?.uzTitle,
               item?.uzDescription,
               item?.uzTranslate,
               item?.kirilTitle,
               item?.kirilDescription,
               item?.kirilTranslate,
               item?.rusTitle,
               item?.rusDescription,
               item?.rusTranslate,
               item?.enTitle,
               item?.enDescription,
               item?.enTranslate,
               "",
               "",
               "",
               item?.link,
               item?.link?.split('/')[item?.link?.split('/').length - 1]
            );
         }

         return res.status(200).json({
            status: 200,
            message: "Success"
         });

      } catch (error) {
         console.log(error);
         res.status(500).json({
            status: 500,
            message: "Internal Server Error"
         });
      }
   },


   ADD_NAME: async (req, res) => {
      try {
         const uploadPhoto = req.file;
         const {
            name_arabic,
            name_title_uzbek,
            name_description_uzbek,
            name_translation_uzbek,
            name_title_cyrillic,
            name_description_cyrillic,
            name_translation_cyrillic,
            name_title_russian,
            name_description_russian,
            name_translation_russian,
            name_title_english,
            name_description_english,
            name_translation_english,
            name_title_kazakh,
            name_description_kazakh,
            name_translation_kazakh,
            audio_link
         } = req.body
         const audioUrl = audio_link ? audio_link : `${process.env.BACKEND_URL}/${uploadPhoto?.filename}`;
         const audioName = audio_link ? null : uploadPhoto?.filename;


         const addName = await model.addName(
            name_arabic,
            name_title_uzbek,
            name_description_uzbek,
            name_translation_uzbek,
            name_title_cyrillic,
            name_description_cyrillic,
            name_translation_cyrillic,
            name_title_russian,
            name_description_russian,
            name_translation_russian,
            name_title_english,
            name_description_english,
            name_translation_english,
            name_title_kazakh,
            name_description_kazakh,
            name_translation_kazakh,
            audioUrl,
            audioName
         )

         if (addName) {
            return res.status(201).json({
               status: 201,
               message: "Created",
               data: addName
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

   EDIT_NAME: async (req, res) => {
      try {
         const uploadPhoto = req.file;
         const {
            name_id,
            name_arabic,
            name_title_uzbek,
            name_description_uzbek,
            name_translation_uzbek,
            name_title_cyrillic,
            name_description_cyrillic,
            name_translation_cyrillic,
            name_title_russian,
            name_description_russian,
            name_translation_russian,
            name_title_english,
            name_description_english,
            name_translation_english,
            name_title_kazakh,
            name_description_kazakh,
            name_translation_kazakh,
            audio_link
         } = req.body
         const foundName = await model.foundName(name_id)
         let audioUrl = '';
         let audioName = '';

         if (uploadPhoto) {
            if (foundName?.name_audio_name) {
               const deleteOldAvatar = new FS(path.resolve(__dirname, '..', '..', '..', 'public', 'images', `${foundName?.name_audio_name}`))
               deleteOldAvatar.delete()
            }
            audioUrl = `${process.env.BACKEND_URL}/${uploadPhoto?.filename}`;
            audioName = uploadPhoto?.filename;
         } else if (audio_link) {
            audioUrl = audio_link;
            audioName = null;
         } else {
            audioUrl = foundName?.name_audio_link;
            audioName = foundName?.name_audio_name;
         }

         const editName = await model.editName(
            name_id,
            name_arabic,
            name_title_uzbek,
            name_description_uzbek,
            name_translation_uzbek,
            name_title_cyrillic,
            name_description_cyrillic,
            name_translation_cyrillic,
            name_title_russian,
            name_description_russian,
            name_translation_russian,
            name_title_english,
            name_description_english,
            name_translation_english,
            name_title_kazakh,
            name_description_kazakh,
            name_translation_kazakh,
            audioUrl,
            audioName
         )

         if (editName) {
            return res.status(200).json({
               status: 200,
               message: "Success",
               data: editName
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

   DELETE_NAME: async (req, res) => {
      try {
         const { name_id } = req.body

         if (name_id) {
            const foundName = await model.foundName(name_id)

            if (foundName) {
               if (foundName?.name_audio_name) {
                  const deleteOldAvatar = new FS(path.resolve(__dirname, '..', '..', '..', 'public', 'images', `${foundName?.name_audio_name}`))
                  deleteOldAvatar.delete()
               }
               const deleteName = await model.deleteName(name_id)

               if (deleteName) {
                  return res.status(200).json({
                     status: 200,
                     message: "Success",
                     data: deleteName
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

         } else {
            return res.status(400).json({
               status: 400,
               message: "Bad request, send name id"
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