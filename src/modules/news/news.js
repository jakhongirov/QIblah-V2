require('dotenv').config();
const model = require('./model')
const path = require('path')
const FS = require('../../lib/fs/fs')

module.exports = {
   GET_ADMIN: async (req, res) => {
      try {
         const { limit, page } = req.query

         if (limit && page) {
            const newsAdminList = await model.newsAdminList(limit, page)

            if (newsAdminList) {
               return res.status(200).json({
                  status: 200,
                  message: "Success",
                  data: newsAdminList
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
               message: "Bad request, write query limit and page"
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

   GET: async (req, res) => {
      try {
         const { limit, page, lang } = req.query

         if (limit && page) {
            const newsList = await model.newsList(limit, page, lang)

            if (newsList) {
               return res.status(200).json({
                  status: 200,
                  message: "Success",
                  data: newsList
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
               message: "Bad request, write query limit and page"
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
            const foundNews = await model.foundNews(id)

            if (foundNews) {
               const editNewsView = await model.editNewsView(id)
               return res.status(200).json({
                  status: 200,
                  message: "Success",
                  data: foundNews
               })

            } else {
               return res.status(404).json({
                  status: 404,
                  message: "Not Found"
               })
            }

         } else {
            return res.status(400).json({
               status: 400,
               message: "Bad request, write news id"
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

   ADD_NEWS: async (req, res) => {
      try {
         const uploadPhoto = req.file;
         const {
            news_title,
            news_description,
            news_button_text,
            news_link,
            news_lang
         } = req.body

         const imgUrl = uploadPhoto ? `${process.env.BACKEND_URL}/${uploadPhoto?.filename}` : null;
         const imgName = uploadPhoto ? uploadPhoto?.filename : null;

         const addNews = await model.addNews(
            news_title,
            news_description,
            news_button_text,
            news_link,
            news_lang,
            imgUrl,
            imgName
         )

         if (addNews) {
            return res.status(201).json({
               status: 201,
               message: "Created",
               data: addNews
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

   EDIT_NEWS: async (req, res) => {
      try {
         const uploadPhoto = req.file;
         const {
            news_id,
            news_title,
            news_description,
            news_button_text,
            news_link,
            news_lang
         } = req.body
         const foundNews = await model.foundNews(news_id)

         if (foundNews) {
            let imgUrl = '';
            let imgName = '';

            if (uploadPhoto) {
               if (foundNews?.news_image_name) {
                  const deleteOldAvatar = new FS(path.resolve(__dirname, '..', '..', '..', 'public', 'images', `${foundNews?.news_image_name}`))
                  deleteOldAvatar.delete()
               }
               imgUrl = `${process.env.BACKEND_URL}/${uploadPhoto?.filename}`;
               imgName = uploadPhoto?.filename;
            } else {
               imgUrl = foundNews?.news_image_link;
               imgName = foundNews?.news_image_name;
            }

            const editNews = await model.editNews(
               news_id,
               news_title,
               news_description,
               news_button_text,
               news_link,
               news_lang,
               imgUrl,
               imgName
            )

            if (editNews) {
               return res.status(200).json({
                  status: 200,
                  message: "Success",
                  data: editNews
               })
            } else {
               return res.json({
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

   EDIT_LIKE_COUNT: async (req, res) => {
      try {
         const { user_id, news_id } = req.body
         const foundNews = await model.foundNews(news_id)

         if (foundNews) {
            const addNewsLike = await model.addNewsLike(user_id, news_id)

            if (addNewsLike) {
               const editNewsLike = await model.editNewsLike(user_id, news_id)
               return res.status(200).json({
                  status: 200,
                  message: "Success",
                  data: editNewsLike
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

   EDIT_VIEW_COUNT: async (req, res) => {
      try {
         const { news_id } = req.body
         const foundNews = await model.foundNews(news_id)

         if (foundNews) {
            const editNewsView = await model.editNewsView(news_id)

            if (editNewsView) {
               return res.status(200).json({
                  status: 200,
                  message: "Success",
                  data: editNewsView
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

   EDIT_STATUS: async (req, res) => {
      try {
         const { news_id, status } = req.body
         const foundNews = await model.foundNews(news_id)

         if (foundNews) {
            const editNewsStatus = await model.editNewsStatus(news_id, status)

            if (editNewsStatus) {
               return res.status(200).json({
                  status: 200,
                  message: "Success",
                  data: editNewsStatus
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

   DELETE_NEWS: async (req, res) => {
      try {
         const { news_id } = req.body
         const foundNews = await model.foundNews(news_id)

         if (foundNews) {
            if (foundNews?.news_image_name) {
               const deleteOldAvatar = new FS(path.resolve(__dirname, '..', '..', '..', 'public', 'images', `${foundNews?.news_image_name}`))
               deleteOldAvatar.delete()
            }

            const deleteNews = await model.deleteNews(news_id)

            if (deleteNews) {
               return res.status(200).json({
                  status: 200,
                  message: "Success",
                  data: deleteNews
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