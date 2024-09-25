const model = require('./model')
const path = require('path')
const FS = require('../../../lib/fs/fs')

module.exports = {
   GET: async (req, res) => {
      try {
         const { lang_id, gender } = req.query

         if (lang_id && gender) {
            const categoriesByLangGender = await model.categories(lang_id, gender)

            if (categoriesByLangGender?.length > 0) {
               return res.status(200).json({
                  status: 200,
                  message: "Success",
                  data: categoriesByLangGender
               })
            } else {
               return res.status(404).json({
                  status: 404,
                  message: "Not found"
               })
            }
         } else if (lang_id) {
            const categoriesByLang = await model.categories(lang_id)

            if (categoriesByLang?.length > 0) {
               return res.status(200).json({
                  status: 200,
                  message: "Success",
                  data: categoriesByLang
               })
            } else {
               return res.status(404).json({
                  status: 404,
                  message: "Not found"
               })
            }
         } else {
            const categories = await model.categories(lang_id)

            if (categories?.length > 0) {
               return res.status(200).json({
                  status: 200,
                  message: "Success",
                  data: categories
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

   ADD_FILE: async (req, res) => {
      try {
         const data = new FS(path.resolve(__dirname, '..', '..', '..', '..', 'files', `prayCategories.json`))
         const file = JSON.parse(data.read())

         for (const item of file) {
            console.log(item?.title)

            await model.addCategoryFile(
               item?.id,
               item?.title,
               item?.description,
               item?.titleColor,
               item?.descriptionColor,
               item?.backgroundColor,
               item?.isBig,
               item?.gender,
               item?.order,
               item?.langID,
               item?.image ? item?.image : '',
               item?.image ? item?.image?.split('https://srvr.qiblah.app/public/images/')[1] : '',
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

   ADD_CATEGORY: async (req, res) => {
      try {
         const uploadPhoto = req.file;
         const {
            category_name,
            category_description,
            category_text_color,
            category_description_color,
            category_background_color,
            category_big,
            category_gender,
            category_order,
            lang_id
         } = req.body
         const imgUrl = `${process.env.BACKEND_URL}/${uploadPhoto?.filename}`;
         const imgName = uploadPhoto?.filename;

         const addCategory = await model.addCategory(
            category_name,
            category_description,
            category_text_color,
            category_description_color,
            category_background_color,
            category_big,
            category_gender,
            category_order,
            lang_id,
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
            category_description,
            category_text_color,
            category_description_color,
            category_background_color,
            category_big,
            category_gender,
            category_order,
            lang_id
         } = req.body

         const foundCategory = await model.foundCategory(category_id)

         if (foundCategory) {
            let imgUrl = '';
            let imgName = '';

            if (uploadPhoto) {
               if (foundCategory?.category_image_name) {
                  const deleteOldAvatar = new FS(path.resolve(__dirname, '..', '..', '..', '..', 'public', 'images', `${foundCategory?.category_image_name}`))
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
               category_description,
               category_text_color,
               category_description_color,
               category_background_color,
               category_big,
               category_gender,
               category_order,
               lang_id,
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

               if (foundCategory?.category_image_name) {
                  const deleteOldAvatar = new FS(path.resolve(__dirname, '..', '..', '..', '..', 'public', 'images', `${foundCategory?.category_image_name}`))
                  deleteOldAvatar.delete()
               }

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