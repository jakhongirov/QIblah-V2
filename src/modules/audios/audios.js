require('dotenv').config();
const model = require('./model')
const path = require('path')
const FS = require('../../lib/fs/fs')

module.exports = {
   GET: async (req, res) => {
      try {
         const { limit, page } = req.query

         if (limit && page) {
            const audiosByLimit = await model.audiosByLimit(limit, page)

            if (audiosByLimit) {
               return res.status(200).json({
                  status: 200,
                  message: "Success",
                  data: audiosByLimit
               })
            } else {
               return res.status(404).json({
                  status: 404,
                  message: "Not found"
               })
            }
         } else {
            const audioslist = await model.audioslist()

            if (audioslist) {
               return res.status(200).json({
                  status: 200,
                  message: "Success",
                  data: audioslist
               })
            } else {
               return res.status(404).json({
                  status: 404,
                  message: "Not found"
               })
            } ƒ
         }

      } catch (error) {
         console.log(error);
         res.status(500).json({
            status: 500,
            message: "Interval Server Error"
         })
      }
   },

   GET_SURA_ID: async (req, res) => {
      try {
         const { sura_id } = req.params

         if (sura_id) {
            const foundBySuraId = await model.foundBySuraId(sura_id)

            if (foundBySuraId) {
               return res.status(200).json({
                  status: 200,
                  message: "Success",
                  data: foundBySuraId
               })
            } else {
               return res.status(404).json({
                  status: 404,
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
   },

   ADD_AUDIO: async (req, res) => {
      try {
         const uploadPhoto = req.file;
         const { author_id, sura_id, time } = req.body
         const audioUrl = `${process.env.BACKEND_URL}/${uploadPhoto?.filename}`;
         const audioName = uploadPhoto?.filename;

         const addAudio = await model.addAudio(author_id, sura_id, JSON.parse(time), audioUrl, audioName)

         if (addAudio) {
            return res.status(200).json({
               status: 200,
               message: "Success",
               data: addAudio
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

   UPDATE_AUDIO: async (req, res) => {
      try {
         const uploadPhoto = req.file;
         const { audio_id, author_id, sura_id, time } = req.body
         const foundAudio = await model.foundAudio(audio_id)
         let audioUrl = '';
         let audioName = '';

         if (foundAudio) {
            if (uploadPhoto) {
               if (foundAudio?.audio_name) {
                  const deleteOldAvatar = new FS(path.resolve(__dirname, '..', '..', '..', 'public', 'images', `${foundAudio?.audio_name}`))
                  deleteOldAvatar.delete()
               }
               audioUrl = `${process.env.BACKEND_URL}/${uploadPhoto?.filename}`;
               audioName = uploadPhoto?.filename;
            } else {
               audioUrl = foundAudio?.audio_link;
               audioName = foundAudio?.audio_name;
            }

            const updateAudio = await model.updateAudio(audio_id, author_id, sura_id, JSON.parse(time), audioUrl, audioName)

            if (updateAudio) {
               return res.status(200).json({
                  status: 200,
                  message: "Success",
                  data: updateAudio
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

   DELETE_AUDIO: async (req, res) => {
      try {
         const { audio_id } = req.body
         const foundAudio = await model.foundAudio(audio_id)

         if (foundAudio) {
            if (foundAudio?.audio_name) {
               const deleteOldAvatar = new FS(path.resolve(__dirname, '..', '..', '..', 'public', 'images', `${foundAudio?.audio_name}`))
               deleteOldAvatar.delete()
            }

            const deleteAudio = await model.deleteAudio(audio_id)

            if (deleteAudio) {
               return res.status(200).json({
                  status: 200,
                  message: "Success",
                  data: deleteAudio
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