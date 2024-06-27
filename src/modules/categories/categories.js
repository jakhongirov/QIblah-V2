const model = require('./model')
const path = require('path')
const FS = require('../../lib/fs/fs')


module.exports = {
   GET: async (req, res) => {
      try {
         const { lang } = req.query

         if (lang) {
            const getCategoriesByLang = await model.getCategoriesByLang(lang)

            if (getCategoriesByLang) {
               return res.status(200).json({
                  status: 200,
                  message: "Success",
                  data: getCategoriesByLang
               })
            } else {
               return res.status(404).json({
                  status: 404,
                  message: "Not found"
               })
            }
         } else {
            const getCategories = await model.getCategories()

            if (getCategories) {
               return res.status(200).json({
                  status: 200,
                  message: "Success",
                  data: getCategories
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

   GET_ID: async (req, res) => {
      try {
         const { id } = req.params

         if (id) {
            const foundCategory = await model.foundCategory(id)

            if (foundCategory) {
               return res.status(200).json({
                  status: 200,
                  message: "Success",
                  data: foundCategory
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
               message: "Bad request, send category id"
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
         const data = new FS(path.resolve(__dirname, '..', '..', '..', 'files', `categories.json`))
         const file = JSON.parse(data.read())

         for (const item of file) {
            await model.addCategory(
               item?.name,
               item?.lang,
               item?.backgrounColor,
               item?.textColor,
               item?.imageLink,
               item?.imageLink,
            )
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

   ADD_CATEGORY: async (req, res) => {
      try {
         const uploadPhoto = req.file;
         const {
            category_name,
            category_lang,
            category_background_color,
            category_text_color
         } = req.body
         const imgUrl = `${process.env.BACKEND_URL}/${uploadPhoto?.filename}`;
         const imgName = uploadPhoto?.filename;

         const addCategory = await model.addCategory(
            category_name,
            category_lang,
            category_background_color,
            category_text_color,
            imgUrl,
            imgName
         )

         if (addCategory) {
            return res.status(201).json({
               status: 201,
               message: "Created",
               data: addCategory
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

   EDIT_CATEGORY: async (req, res) => {
      try {
         const uploadPhoto = req.file;
         const {
            category_id,
            category_name,
            category_lang,
            category_background_color,
            category_text_color
         } = req.body
         const foundCategory = await model.foundCategory(category_id)

         if (foundCategory) {
            let imgUrl = '';
            let imgName = '';

            if (uploadPhoto) {
               if (foundCategory?.news_image_name) {
                  const deleteOldAvatar = new FS(path.resolve(__dirname, '..', '..', '..', 'public', 'images', `${foundCategory?.category_image_name}`))
                  deleteOldAvatar.delete()
               }
               imgUrl = `${process.env.BACKEND_URL}/${uploadPhoto?.filename}`;
               imgName = uploadPhoto?.filename;
            } else {
               imgUrl = foundCategory?.category_image_link;
               imgName = foundCategory?.category_image_name;
            }

            const editCategory = await model.editCategory(
               category_id,
               category_name,
               category_lang,
               category_background_color,
               category_text_color,
               imgUrl,
               imgName
            )

            if (editCategory) {
               return res.status(200).json({
                  status: 200,
                  message: "Success",
                  data: editCategory
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

   DELETE_CATEGORY: async (req, res) => {
      try {
         const { category_id } = req.body
         const foundCategory = await model.foundCategory(category_id)

         if (foundCategory) {
            const deleteCategory = await model.deleteCategory(category_id)

            if (deleteCategory) {
               return res.status(200).json({
                  status: 200,
                  message: "Success",
                  data: deleteCategory
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