const model = require('./model')

module.exports = {
   GET: async (req, res) => {
      try {
         const { limit, page } = req.query

         if (limit && page) {
            const getTapeList = await model.getTapeList(limit, page)

            if (getTapeList) {
               return res.status(200).json({
                  status: 200,
                  message: "Success",
                  data: getTapeList
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

         if (id) {
            const foundTape = await model.foundTape(id)

            if (foundTape) {
               return res.status(200).json({
                  status: 200,
                  message: "Success",
                  data: foundTape
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
               message: "Must write tape id"
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

   GET_BY_DATE: async (req, res) => {
      try {
         const { lang } = req.query
         const today = new Date();
         const year = today.getFullYear();
         const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
         const day = String(today.getDate()).padStart(2, '0');
         const formattedDateTime = `${day}.${month}.${year}`;
         const foundTapeByDate = await model.foundTapeByDate(formattedDateTime)

         if (foundTapeByDate) {
            const foundVerse = await model.foundVerse(foundTapeByDate?.verse_id, lang)
            const foundName = await model.foundName(foundTapeByDate?.name_id, lang)
            const foundNews = await model.foundNews(foundTapeByDate?.news_id, lang)

            if (lang == 'uzbek') {
               const foundZikr = await model.foundZikr(foundTapeByDate?.zikr_id?.uz)
               const foundDua = await model.foundZikr(foundTapeByDate?.dua_id?.uz)

               return res.status(200).json({
                  status: 200,
                  message: "Success",
                  zikr: foundZikr,
                  dua: foundDua,
                  verse: foundVerse,
                  name: foundName,
                  news: foundNews
               })
            } else if (lang == 'cyrillic') {
               const foundZikr = await model.foundZikr(foundTapeByDate?.zikr_id?.cr)
               const foundDua = await model.foundZikr(foundTapeByDate?.dua_id?.cr)

               return res.status(200).json({
                  status: 200,
                  message: "Success",
                  zikr: foundZikr,
                  dua: foundDua,
                  verse: foundVerse,
                  name: foundName,
                  news: foundNews
               })
            } else if (lang == 'russian') {
               const foundZikr = await model.foundZikr(foundTapeByDate?.zikr_id?.ru)
               const foundDua = await model.foundZikr(foundTapeByDate?.dua_id?.ru)

               return res.status(200).json({
                  status: 200,
                  message: "Success",
                  zikr: foundZikr,
                  dua: foundDua,
                  verse: foundVerse,
                  name: foundName,
                  news: foundNews
               })
            } else if (lang == 'english') {
               const foundZikr = await model.foundZikr(foundTapeByDate?.zikr_id?.en)
               const foundDua = await model.foundZikr(foundTapeByDate?.dua_id?.en)

               return res.status(200).json({
                  status: 200,
                  message: "Success",
                  zikr: foundZikr,
                  dua: foundDua,
                  verse: foundVerse,
                  name: foundName,
                  news: foundNews
               })
            } else if (lang == 'kazakh') {
               const foundZikr = await model.foundZikr(foundTapeByDate?.zikr_id?.kz)
               const foundDua = await model.foundZikr(foundTapeByDate?.dua_id?.kz)

               return res.status(200).json({
                  status: 200,
                  message: "Success",
                  zikr: foundZikr,
                  dua: foundDua,
                  verse: foundVerse,
                  name: foundName,
                  news: foundNews
               })
            } else {
               return res.status(400).json({
                  status: 400,
                  message: "Bad request write lang"
               })
            }

         } else {
            const foundZikrRandom = await model.foundZikrRandom(lang)
            const foundDuaRandom = await model.foundZikrRandom(lang)
            const foundVerseRandom = await model.foundVerseRandom(lang)
            const foundNameRandom = await model.foundNameRandom(lang)
            const foundNewsRandom = await model.foundNewsRandom(lang)

            return res.status(200).json({
               status: 200,
               message: "Success",
               zikr: foundZikrRandom,
               dua: foundDuaRandom,
               verse: foundVerseRandom,
               name: foundNameRandom,
               news: foundNewsRandom
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

   ADD_TAPE: async (req, res) => {
      try {
         const {
            tape_date,
            verse_id,
            zikr_id,
            name_id,
            dua_id,
            news_id
         } = req.body

         const addTape = await model.addTape(
            tape_date,
            verse_id,
            zikr_id,
            name_id,
            dua_id,
            news_id
         )

         if (addTape) {
            return res.status(200).json({
               status: 200,
               message: "Success",
               data: addTape
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

   EDIT_TYPE: async (req, res) => {
      try {
         const {
            tape_id,
            tape_date,
            verse_id,
            zikr_id,
            name_id,
            dua_id,
            news_id
         } = req.body
         const foundTape = await model.foundTape(tape_id)

         if (foundTape) {
            const editTape = await model.editTape(
               tape_id,
               tape_date,
               verse_id,
               zikr_id,
               name_id,
               dua_id,
               news_id
            )

            if (editTape) {
               return res.status(200).json({
                  status: 200,
                  message: "Success",
                  data: editTape
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

   DELETE_TAPE: async (req, res) => {
      try {
         const { tape_id } = req.body
         const foundTape = await model.foundTape(tape_id)

         if (foundTape) {
            const deleteTape = await model.deleteTape(tape_id)

            if (deleteTape) {
               return res.status(200).json({
                  status: 200,
                  message: "Success",
                  data: deleteTape
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