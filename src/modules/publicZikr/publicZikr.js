require('dotenv').config();
const model = require('./model')
const path = require('path')
const FS = require('../../lib/fs/fs')
const socket = require('../../lib/socket');

module.exports = {
   GET: async (req, res) => {
      try {
         const { limit, page, lang } = req.query

         if (limit && page) {
            const publicZikrs = await model.publicZikrs(lang, limit, page)

            if (publicZikrs) {
               return res.status(200).json({
                  status: 200,
                  message: "Success",
                  data: publicZikrs
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
               message: "Bad request, send limit and page"
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
            const foundZikr = await model.foundZikr(id, lang)

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
               message: "Bad request, send zikr_id"
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

   ADD_PUBLIC_ZIKR: async (req, res) => {
      try {
         const uploadPhoto = req.file;
         const {
            zikr_title_uzbek,
            zikr_description_uzbek,
            zikr_title_cyrillic,
            zikr_description_cyrillic,
            zikr_title_russian,
            zikr_description_russian,
            zikr_title_english,
            zikr_description_english,
            zikr_title_kazakh,
            zikr_description_kazakh,
            zikr_count,
            supporter_lang,
            zikr_info_uzbek,
            zikr_info_cyrillic,
            zikr_info_russian,
            zikr_info_english,
            zikr_info_kazakh,
            audio_link
         } = req.body
         const audioUrl = audio_link ? audio_link : `${process.env.BACKEND_URL}/${uploadPhoto?.filename}`;
         const audioName = audio_link ? null : uploadPhoto?.filename;

         const addPublicZikr = await model.addPublicZikr(
            zikr_title_uzbek,
            zikr_description_uzbek,
            zikr_title_cyrillic,
            zikr_description_cyrillic,
            zikr_title_russian,
            zikr_description_russian,
            zikr_title_english,
            zikr_description_english,
            zikr_title_kazakh,
            zikr_description_kazakh,
            zikr_count,
            JSON.parse(supporter_lang),
            audioUrl,
            audioName,
            zikr_info_uzbek,
            zikr_info_cyrillic,
            zikr_info_russian,
            zikr_info_english,
            zikr_info_kazakh,
         )

         if (addPublicZikr) {
            return res.status(200).json({
               status: 200,
               message: "Success",
               data: addPublicZikr
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

   EDIT_PUBLIC_ZIKR: async (req, res) => {
      try {
         const uploadPhoto = req.file;
         const {
            zikr_id,
            zikr_title_uzbek,
            zikr_description_uzbek,
            zikr_title_cyrillic,
            zikr_description_cyrillic,
            zikr_title_russian,
            zikr_description_russian,
            zikr_title_english,
            zikr_description_english,
            zikr_title_kazakh,
            zikr_description_kazakh,
            zikr_count,
            supporter_lang,
            zikr_info_uzbek,
            zikr_info_cyrillic,
            zikr_info_russian,
            zikr_info_english,
            zikr_info_kazakh,
            audio_link
         } = req.body
         const foundZikr = await model.foundZikr(zikr_id)
         let audioUrl = '';
         let audioName = '';

         if (uploadPhoto) {
            if (foundZikr?.zikr_audio_name) {
               const deleteOldAvatar = new FS(path.resolve(__dirname, '..', '..', '..', 'public', 'images', `${foundZikr?.zikr_audio_name}`))
               deleteOldAvatar.delete()
            }
            audioUrl = `${process.env.BACKEND_URL}/${uploadPhoto?.filename}`;
            audioName = uploadPhoto?.filename;
         } else if (audio_link) {
            audioUrl = audio_link;
            audioName = null;
         } else {
            audioUrl = foundZikr?.zikr_audio_link;
            audioName = foundZikr?.zikr_audio_name;
         }

         const editPublicZikr = await model.editPublicZikr(
            zikr_id,
            zikr_title_uzbek,
            zikr_description_uzbek,
            zikr_title_cyrillic,
            zikr_description_cyrillic,
            zikr_title_russian,
            zikr_description_russian,
            zikr_title_english,
            zikr_description_english,
            zikr_title_kazakh,
            zikr_description_kazakh,
            zikr_count,
            JSON.parse(supporter_lang),
            audioUrl,
            audioName,
            zikr_info_uzbek,
            zikr_info_cyrillic,
            zikr_info_russian,
            zikr_info_english,
            zikr_info_kazakh,
         )

         if (editPublicZikr) {
            return res.status(200).json({
               status: 200,
               message: "Success",
               data: editPublicZikr
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

   EDIT_PARTICIPANTS: async (req, res) => {
      try {
         const { zikr_id, user_id } = req.body
         const addParticipants = await model.addParticipants(zikr_id, user_id)

         if (addParticipants) {
            await model.updateZikrParticipants(zikr_id)
            return res.status(200).json({
               status: 200,
               message: "Success",
               data: addParticipants
            })
         } else {
            return res.status(400).json({
               status: 302,
               message: "Found"
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

   EDIT_COUNT: async (req, res) => {
      try {
         const { id } = req.params;
         const io = socket.getIO();

         // Emit the 'incrementZikrCount' event to all connected clients
         io.emit("incrementZikrCount", id);

         return res.status(200).json({
            status: 200,
            message: "Success",
         });
      } catch (error) {
         console.log(error);
         res.status(500).json({
            status: 500,
            message: "Internal Server Error",
         });
      }
   },

   EDIT_FINISHING: async (req, res) => {
      try {
         const { zikr_id, finishing } = req.body
         const foundZikr = await model.foundZikr(zikr_id)

         if (foundZikr) {
            const editFinishing = await model.editFinishing(zikr_id, finishing)

            if (editFinishing) {
               return res.status(200).json({
                  status: 200,
                  message: "Success",
                  data: editFinishing
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

   DELETE_PUBLIC_ZIKR: async (req, res) => {
      try {
         const { zikr_id } = req.body
         const foundZikr = await model.foundZikr(zikr_id)

         if (foundZikr) {
            if (foundZikr?.zikr_audio_name) {
               const deleteOldAvatar = new FS(path.resolve(__dirname, '..', '..', '..', 'public', 'images', `${foundZikr?.zikr_audio_name}`))
               deleteOldAvatar.delete()
            }
            const deletePublicZikr = await model.deletePublicZikr(zikr_id)

            if (deletePublicZikr) {
               return res.status(200).json({
                  status: 200,
                  message: "Success",
                  data: deletePublicZikr
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