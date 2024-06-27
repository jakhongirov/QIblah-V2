const model = require('./model')

module.exports = {
   // QURAN UPDATEDS
   GET_ADMIN: async (req, res) => {
      try {
         const { limit, page } = req.query

         if (limit, page) {
            const quranUpdatesByLimit = await model.quranUpdatesByLimit(limit, page)

            if (quranUpdatesByLimit) {
               return res.status(200).json({
                  status: 200,
                  message: "Success",
                  data: quranUpdatesByLimit
               })
            } else {
               return res.status(404).json({
                  status: 404,
                  message: "Not found"
               })
            }

         } else {
            const quranUpdates = await model.quranUpdates()

            if (quranUpdates) {
               return res.status(200).json({
                  status: 200,
                  message: "Success",
                  data: quranUpdates
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

   GET_UPDATES: async (req, res) => {
      try {
         const { lang } = req.query
         const { version } = req.body

         if (version) {
            const getUpdates = await model.getUpdates(version)
            const mergedVerses = await getUpdates?.reduce((accumulator, currentValue) => {
               currentValue.verse_id.forEach(id => {
                  if (!accumulator.includes(id)) {
                     accumulator.push(id);
                  }
               });
               return accumulator;
            }, []);

            if (mergedVerses?.length > 0) {
               const getUpdatedVerse = await model.getUpdatedVerse(mergedVerses, lang)

               if (getUpdatedVerse) {
                  return res.status(200).json({
                     status: 200,
                     message: "Success",
                     data: getUpdatedVerse
                  })
               } else {
                  return res.status(404).json({
                     status: 404,
                     message: "Not found"
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

   ADD_UPDATED: async (req, res) => {
      try {
         const { quran_version, verse_id } = req.body

         const addUpdated = await model.addUpdated(quran_version, verse_id)

         if (addUpdated) {
            return res.status(200).json({
               status: 200,
               message: "Success",
               data: addUpdated
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

   UPDATE_UPDATES: async (req, res) => {
      try {
         const {
            version_id,
            quran_version,
            verse_id
         } = req.body
         const foundQuranUpdateds = await model.foundQuranUpdateds(version_id)

         if (foundQuranUpdateds) {
            const updateQuranUpdated = await model.updateQuranUpdated(
               version_id,
               quran_version,
               verse_id
            )

            if (updateQuranUpdated) {
               return res.status(200).json({
                  status: 200,
                  message: "Success",
                  data: updateQuranUpdated
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

   DELETE_QURAN_UPDATES: async (req, res) => {
      try {
         const { version_id } = req.body
         const foundQuranUpdateds = await model.foundQuranUpdateds(version_id)

         if (foundQuranUpdateds) {
            const deleteQuranUpdated = await model.deleteQuranUpdated(version_id)

            if (deleteQuranUpdated) {
               return res.status(200).json({
                  status: 200,
                  message: "Success",
                  data: deleteQuranUpdated
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

   // VERSION
   GET_VERSION: async (req, res) => {
      try {
         const { limit, page } = req.query

         if (limit, page) {
            const versionsByLimit = await model.versionsByLimit(limit, page)

            if (versionsByLimit) {
               return res.status(200).json({
                  status: 200,
                  message: "Success",
                  data: versionsByLimit
               })
            } else {
               return res.status(404).json({
                  status: 404,
                  message: "Not found"
               })
            }

         } else {
            const quranLastVersion = await model.quranLastVersion()
            const versionsUpdates = await model.versionsUpdates()
            versionsUpdates['quran_version'] = quranLastVersion?.quran_version

            if (versionsUpdates) {
               return res.status(200).json({
                  status: 200,
                  message: "Success",
                  data: versionsUpdates
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

   ADD_VERSION: async (req, res) => {
      try {
         const {
            zikr_version,
            names_99_version,
            audios_version,
            meditation_votes,
            meditation_categories
         } = req.body

         const addVersion = await model.addVersion(
            zikr_version,
            names_99_version,
            audios_version,
            meditation_votes,
            meditation_categories
         )

         if (addVersion) {
            return res.status(200).json({
               status: 200,
               message: "Success",
               data: addVersion
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

   UPDATE_VERSION: async (req, res) => {
      try {
         const {
            version_id,
            zikr_version,
            names_99_version,
            audios_version,
            meditation_votes,
            meditation_categories
         } = req.body

         const updateVersion = await model.updateVersion(
            version_id,
            zikr_version,
            names_99_version,
            audios_version,
            meditation_votes,
            meditation_categories
         )

         if (updateVersion) {
            return res.status(200).json({
               status: 200,
               message: "Success",
               data: updateVersion
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

   DELETE_VERSION: async (req, res) => {
      try {
         const { version_id } = req.body

         const deleteVersion = await model.deleteVersion(version_id)

         if (deleteVersion) {
            return res.status(200).json({
               status: 200,
               message: "Success",
               data: deleteVersion
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
   }
}


