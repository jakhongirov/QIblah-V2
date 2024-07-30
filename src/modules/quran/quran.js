require('dotenv').config();
const model = require('./model')
const path = require('path')
const FS = require('../../lib/fs/fs')

module.exports = {
   GET: async (req, res) => {
      try {
         const { limit, page, lang } = req.query

         if (limit && page) {
            const quranList = await model.quranList(lang, limit, page)

            if (quranList) {
               return res.status(200).json({
                  status: 200,
                  message: "Success",
                  data: quranList
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
         const { lang } = req.query

         if (id) {
            const foundSura = await model.foundSura(id, lang)

            if (foundSura) {
               return res.status(200).json({
                  status: 200,
                  message: "Success",
                  data: foundSura
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

   ADD_FILE: async (req, res) => {
      try {
         const data = new FS(path.resolve(__dirname, '..', '..', '..', 'files', `suralar.json`))
         const file = JSON.parse(data.read())

         for (const item of file) {
            await model.editSura(
               item?.id,
               item?.arabicName,
               item?.uzLatinName,
               item?.uzKirilName,
               item?.ruName,
               item?.enName,
               item?.kzName,
               item?.count,
               item?.from,
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
            message: "Interval Server Error"
         })
      }
   },

   ADD_SURA: async (req, res) => {
      try {
         const {
            sura_name_arabic,
            sura_name_uzbek,
            sura_name_cyrillic,
            sura_name_russian,
            sura_name_english,
            sura_name_kazakh,
            sura_verse_count,
            sura_from
         } = req.body

         const addSura = await model.addSura(
            sura_name_arabic,
            sura_name_uzbek,
            sura_name_cyrillic,
            sura_name_russian,
            sura_name_english,
            sura_name_kazakh,
            sura_verse_count,
            sura_from
         )

         if (addSura) {
            return res.status(201).json({
               status: 201,
               message: "Created",
               data: addSura
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

   EDIT_SURA: async (req, res) => {
      try {
         const {
            sura_id,
            sura_name_arabic,
            sura_name_uzbek,
            sura_name_cyrillic,
            sura_name_russian,
            sura_name_english,
            sura_name_kazakh,
            sura_verse_count,
            sura_from
         } = req.body
         const foundSura = await model.foundSura(sura_id)

         if (foundSura) {
            const editSura = await model.editSura(
               sura_id,
               sura_name_arabic,
               sura_name_uzbek,
               sura_name_cyrillic,
               sura_name_russian,
               sura_name_english,
               sura_name_kazakh,
               sura_verse_count,
               sura_from
            )

            if (editSura) {
               return res.status(200).json({
                  status: 200,
                  message: "Success",
                  data: editSura
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

   DELETE_SURA: async (req, res) => {
      try {
         const { sura_id } = req.body

         if (sura_id) {
            const foundSura = await model.foundSura(sura_id)

            if (foundSura) {
               const deleteSura = await model.deleteSura(sura_id)

               if (deleteSura) {
                  return res.status(200).json({
                     status: 200,
                     message: "Success",
                     data: deleteSura
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
               message: "Bad request, send sura id"
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