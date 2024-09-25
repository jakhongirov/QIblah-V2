const model = require('./model')
const path = require('path')
const FS = require('../../../lib/fs/fs')

module.exports = {
   GET: async (_, res) => {
      try {
         const languages = await model.languages()

         if (languages?.length > 0) {
            return res.status(200).json({
               status: 200,
               message: "Success",
               data: languages
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
         const data = new FS(path.resolve(__dirname, '..', '..', '..', '..', 'files', `languages.json`))
         const file = JSON.parse(data.read())

         for (const item of file) {
            console.log(item?.lang)

            await model.addLangFile(
               item?.id,
               item?.lang,
            )
         }

         console.log('stop')

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

   ADD_LANG: async (req, res) => {
      try {
         const { name } = req.body

         const addLang = await model.addLang(name)

         if (addLang) {
            return res.status(200).json({
               status: 200,
               message: "Success",
               data: addLang
            })
         } else {
            return res.status(400).json({
               status: 400,
               message: "Bad Request"
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

   EDIT_LANG: async (req, res) => {
      try {
         const { id, name } = req.body

         const editLang = await model.editLang(id, name)

         if (editLang) {
            return res.status(200).json({
               status: 200,
               message: "Success",
               data: editLang
            })
         } else {
            return res.status(400).json({
               status: 400,
               message: "Bad Request"
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

   DELETE_LANG: async (req, res) => {
      try {
         const { id } = req.body

         const deleteLang = await model.deleteLang(id)

         if (deleteLang) {
            return res.status(200).json({
               status: 200,
               message: "Success",
               data: deleteLang
            })
         } else {
            return res.status(400).json({
               status: 400,
               message: "Bad Request"
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