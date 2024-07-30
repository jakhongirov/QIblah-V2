const model = require('./model')
const path = require('path')
const FS = require('../../lib/fs/fs')

module.exports = {
   GET: async (req, res) => {
      try {
         const { limit, page } = req.query

         if (limit && page) {
            const versesList = await model.versesList(limit, page)

            if (versesList) {
               return res.status(200).json({
                  status: 200,
                  message: "Success",
                  data: versesList
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

   GET_SURA: async (req, res) => {
      try {
         const { suraId } = req.params
         const { lang } = req.query

         if (suraId) {
            const versesBySura = await model.versesBySura(suraId, lang)

            if (versesBySura) {
               return res.status(200).json({
                  status: 200,
                  message: "Success",
                  data: versesBySura
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

   GET_ID: async (req, res) => {
      try {
         const { id } = req.params
         const { lang } = req.query

         if (id) {
            const foundVerse = await model.foundVerse(id, lang)

            if (foundVerse) {
               return res.status(200).json({
                  status: 200,
                  message: "Success",
                  data: foundVerse
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

   GET_JUZ: async (req, res) => {
      try {
         const { number } = req.params
         const { lang } = req.query

         if (number) {
            const getVersesByJuz = await model.getVersesByJuz(number, lang)

            if (getVersesByJuz) {
               return res.status(200).json({
                  status: 200,
                  message: "Success",
                  data: getVersesByJuz
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
         const data = new FS(path.resolve(__dirname, '..', '..', '..', 'files', `oyatlar.json`))
         const file = JSON.parse(data.read())

         console.log(file);

         for (const item of file) {
            await model.editVerse(
               item?.id,
               item?.arabText,
               item?.uzText,
               item?.uzMeaning,
               item?.uzKirilText,
               item?.uzKirilMeaning,
               item?.ruText,
               item?.ruMeaning,
               item?.enText,
               item?.enMeaning,
               item?.kzText,
               item?.kzMeaning,
               item?.suraID,
               item?.relativeSurahID,
               item?.juzRaqami,
               item?.juzText,
               item?.suraID,
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

   ADD_VERSE: async (req, res) => {
      try {
         const {
            verse_arabic,
            verse_uzbek,
            verse_meaning_uzbek,
            verse_cyrillic,
            verse_meaning_cyrillic,
            verse_russian,
            verse_meaning_russian,
            verse_english,
            verse_meaning_english,
            verse_kazakh,
            verse_meaning_kazakh,
            sura_id,
            verse_number,
            juz_number,
            juz_divider_text,
            sura_number
         } = req.body

         const addVerse = await model.addVerse(
            verse_arabic,
            verse_uzbek,
            verse_meaning_uzbek,
            verse_cyrillic,
            verse_meaning_cyrillic,
            verse_russian,
            verse_meaning_russian,
            verse_english,
            verse_meaning_english,
            verse_kazakh,
            verse_meaning_kazakh,
            sura_id,
            verse_number,
            juz_number,
            juz_divider_text,
            sura_number
         )

         if (addVerse) {
            return res.status(201).json({
               status: 201,
               message: "Created",
               data: addVerse
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

   EDIT_VERSE: async (req, res) => {
      try {
         const {
            verse_id,
            verse_arabic,
            verse_uzbek,
            verse_meaning_uzbek,
            verse_cyrillic,
            verse_meaning_cyrillic,
            verse_russian,
            verse_meaning_russian,
            verse_english,
            verse_meaning_english,
            verse_kazakh,
            verse_meaning_kazakh,
            sura_id,
            verse_number,
            juz_number,
            juz_divider_text,
            sura_number
         } = req.body
         const foundVerse = await model.foundVerse(verse_id)

         if (foundVerse) {
            const editVerse = await model.editVerse(
               verse_id,
               verse_arabic,
               verse_uzbek,
               verse_meaning_uzbek,
               verse_cyrillic,
               verse_meaning_cyrillic,
               verse_russian,
               verse_meaning_russian,
               verse_english,
               verse_meaning_english,
               verse_kazakh,
               verse_meaning_kazakh,
               sura_id,
               verse_number,
               juz_number,
               juz_divider_text,
               sura_number
            )

            if (editVerse) {
               return res.status(200).json({
                  status: 200,
                  message: "Success",
                  data: editVerse
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
   DELETE_VERSE: async (req, res) => {
      try {
         const { verse_id } = req.body
         const foundVerse = await model.foundVerse(verse_id)

         if (foundVerse) {
            const deleteVerse = await model.deleteVerse(verse_id)

            if (deleteVerse) {
               return res.status(200).json({
                  status: 200,
                  message: "Success",
                  data: deleteVerse
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