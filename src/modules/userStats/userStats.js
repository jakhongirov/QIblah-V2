const model = require('./model')

module.exports = {
   GET_ADMIN: async (req, res) => {
      try {
         const { limit, page } = req.query

         if (limit && page) {
            const getAdminUserStats = await model.getAdminUserStats(limit, page)

            if (getAdminUserStats) {
               return res.status(200).json({
                  status: 200,
                  message: "Success",
                  data: getAdminUserStats
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

   GET_USER_ID: async (req, res) => {
      try {
         const { user_id } = req.params

         if (user_id) {
            const foundUserStat = await model.foundUserStat(user_id)

            if (foundUserStat) {
               return res.status(200).json({
                  status: 200,
                  message: "Success",
                  data: foundUserStat
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
               message: "Bad request, send user_id"
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

   CREATE_USER_STATS: async (req, res) => {
      try {
         const {
            user_id,
            user_qazo,
            verse_id,
            read_verse,
            name_count,
            zikr_id,
            zikr_count
         } = req.body
         const foundUserStat = await model.foundUserStat(user_id)

         if (foundUserStat) {

            if (
               user_qazo &&
               verse_id?.length > 0 &&
               read_verse?.length > 0 &&
               name_count?.length > 0 &&
               zikr_id?.length > 0 &&
               zikr_count?.length > 0
            ) {
               const editUserStats = await model.editUserStats(
                  user_id,
                  user_qazo,
                  verse_id,
                  read_verse,
                  name_count,
                  zikr_id,
                  zikr_count
               )

               if (editUserStats) {
                  for (const item of verse_id) {
                     await model.updateVerseFavCount(item)
                  }
                  for (const item of zikr_id) {
                     await model.updateZikrFavCount(item)
                  }

                  return res.status(200).json({
                     status: 200,
                     message: "Success",
                     data: editUserStats
                  })
               } else {
                  return res.status(200).json({
                     status: 400,
                     message: "Bad request"
                  })
               }

            } else {
               if (user_qazo) {
                  await model.editUserQazo(user_id, user_qazo)
               }

               if (verse_id?.length > 0) {
                  const editVerseId = await model.editVerseId(user_id, verse_id)

                  if (editVerseId) {
                     for (const item of verse_id) {
                        await model.updateVerseFavCount(item)
                     }
                  }
               }

               if (read_verse?.length > 0) {
                  await model.editVerseRead(user_id, read_verse)
               }

               if (name_count?.length > 0) {
                  await model.editNameCount(user_id, name_count)
               }

               if (zikr_id?.length > 0) {
                  const editZikrId = await model.editZikrId(user_id, zikr_id)

                  if (editZikrId) {
                     for (const item of zikr_id) {
                        await model.updateZikrFavCount(item)
                     }
                  }
               }

               if (zikr_count?.length > 0) {
                  await model.editZikrCount(user_id, zikr_count)
               }

               const foundNewUserStats = await model.foundUserStat(user_id)

               if (foundNewUserStats) {
                  return res.status(200).json({
                     status: 200,
                     message: "Success",
                     data: foundNewUserStats
                  })
               } else {
                  return res.status(400).json({
                     status: 400,
                     message: "Bad request"
                  })
               }
            }

         } else {
            const addUserStats = await model.addUserStats(
               user_id,
               user_qazo,
               verse_id,
               read_verse,
               name_count,
               zikr_id,
               zikr_count
            )

            if (addUserStats) {

               for (const item of verse_id) {
                  await model.updateVerseFavCount(item)
               }

               for (const item of zikr_id) {
                  await model.updateZikrFavCount(item)
               }

               return res.status(200).json({
                  status: 200,
                  message: "Success",
                  data: addUserStats
               })
            } else {
               return res.status(400).json({
                  status: 400,
                  message: "Bad request"
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

   DELETE_USER_STATS: async (req, res) => {
      try {
         const { user_id } = req.body
         const deleteUserStats = await model.deleteUserStats(user_id)

         if (deleteUserStats) {
            return res.status(200).json({
               status: 200,
               message: "Success",
               data: deleteUserStats
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