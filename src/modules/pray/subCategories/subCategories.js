const model = require('./model')
const path = require('path')
const FS = require('../../../lib/fs/fs')

module.exports = {
   GET: async (req, res) => {
      try {
         const { category_id } = req.query

         if (category_id) {
            const subCategoriesByCategoryID = await model.subCategories(category_id)

            if (subCategoriesByCategoryID?.length > 0) {
               return res.status(200).json({
                  status: 200,
                  message: "Success",
                  data: subCategoriesByCategoryID
               })
            } else {
               return res.status(404).json({
                  status: 404,
                  message: "Not found"
               })
            }
         } else {
            const subCategories = await model.subCategories()

            if (subCategories?.length > 0) {
               return res.status(200).json({
                  status: 200,
                  message: "Success",
                  data: subCategories
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
         const data = new FS(path.resolve(__dirname, '..', '..', '..', '..', 'files', ``))
         const file = JSON.parse(data.read())

         for (const item of file) {
            console.log(item?.title)

            await model.addSubCategoriesFile(
               item?.id,
               item?.title,
               item?.haveItems,
               item?.isNumeric,
               item?.categoryID,
               item?.icon ? item?.icon : "",
               item?.icon ? item?.icon?.split("https://srvr.qiblah.app/public/images/")[1] : "",
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

   ADD_SUB_CATEGORIES: async (req, res) => {
      try {
         const uploadPhoto = req.file;
         const {
            sub_category_name,
            have_item,
            numeric,
            category_id
         } = req.body
         const imgUrl = `${process.env.BACKEND_URL}/${uploadPhoto?.filename}`;
         const imgName = uploadPhoto?.filename;

         const addSubCategories = await model.addSubCategories(
            sub_category_name,
            have_item,
            numeric,
            category_id,
            imgUrl,
            imgName
         )

         if (addSubCategories) {
            return res.status(201).json({
               status: 201,
               message: "Created",
               data: addSubCategories
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

   EDIT_SUB_CATEGORIES: async (req, res) => {
      try {
         const uploadPhoto = req.file;
         const {
            sub_category_id,
            sub_category_name,
            have_item,
            numeric,
            category_id
         } = req.body
         const foundSubCategory = await model.foundSubCategory(sub_category_id)

         if (foundSubCategory) {
            let imgUrl = '';
            let imgName = '';

            if (uploadPhoto) {
               if (foundSubCategory?.sub_category_image_name) {
                  const deleteOldAvatar = new FS(path.resolve(__dirname, '..', '..', '..', '..', 'public', 'images', `${foundSubCategory?.sub_category_image_name}`))
                  deleteOldAvatar.delete()
               }
               imgUrl = `${process.env.BACKEND_URL}/${uploadPhoto?.filename}`;
               imgName = uploadPhoto?.filename;
            } else {
               imgUrl = foundSubCategory?.sub_category_image_link;
               imgName = foundSubCategory?.sub_category_image_name;
            }

            const editSubCategory = await model.editSubCategory(
               sub_category_id,
               sub_category_name,
               have_item,
               numeric,
               category_id,
               imgUrl,
               imgName
            )

            if (editSubCategory) {
               return res.status(200).json({
                  status: 200,
                  message: "Success",
                  data: editSubCategory
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

   DELETE_SUB_CATEGORIES: async (req, res) => {
      try {
         const { sub_category_id } = req.body
         const foundSubCategory = await model.foundSubCategory(sub_category_id)

         if (foundSubCategory) {
            const deleteSubCategory = await model.deleteSubCategory(sub_category_id)

            if (deleteSubCategory) {

               if (foundSubCategory?.sub_category_image_name) {
                  const deleteOldAvatar = new FS(path.resolve(__dirname, '..', '..', '..', '..', 'public', 'images', `${foundSubCategory?.sub_category_image_name}`))
                  deleteOldAvatar.delete()
               }

               return res.status(200).json({
                  status: 200,
                  message: "Success",
                  data: deleteSubCategory
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