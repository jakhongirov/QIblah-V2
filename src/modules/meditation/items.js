require('dotenv').config();
const model = require('./model')
const path = require('path')
const FS = require('../../lib/fs/fs')
const mp3Duration = require('mp3-duration');

function formatDuration(seconds) {
   const hours = Math.floor(seconds / 3600);
   const minutes = Math.floor((seconds % 3600) / 60);
   const remainingSeconds = Math.floor(seconds % 60);

   const formattedHours = hours.toString().padStart(2, '0');
   const formattedMinutes = minutes.toString().padStart(2, '0');
   const formattedSeconds = remainingSeconds.toString().padStart(2, '0');

   return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

module.exports = {
   GET_ADMIN: async (req, res) => {
      try {
         const { limit, page } = req.query

         if (limit && page) {
            const itemsListAdmin = await model.itemsListAdmin(limit, page)

            if (itemsListAdmin?.length > 0) {
               return res.status(200).json({
                  status: 200,
                  message: "Success",
                  data: itemsListAdmin
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

   GET_CATEGORIES: async (req, res) => {
      try {
         const { category_id } = req.query

         if (category_id) {
            const versionCategory = await model.versionCategory()
            const itemsListByCategory = await model.itemsListByCategory(category_id)

            if (itemsListByCategory?.length > 0) {
               return res.status(200).json({
                  status: 200,
                  message: "Success",
                  data: itemsListByCategory,
                  version: versionCategory?.meditation_item
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
               message: "Bad request, write category_id"
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

   ADD_ITEM: async (req, res) => {
      try {
         const uploadPhoto = req.file;
         const { item_name, category_id, item_description, suggested_item } = req.body
         const audioUrl = `${process.env.BACKEND_URL}/${uploadPhoto?.filename}`;
         const audioName = uploadPhoto?.filename;
         const filePath = uploadPhoto.path;

         mp3Duration(filePath, async function (err, duration) {
            if (err) {
               console.error('Error getting MP3 duration:', err);
               // If there's an error getting the duration, respond with an error
               return res.status(500).json({
                  status: 500,
                  message: "Error getting MP3 duration"
               });
            }

            // Call your model to add the item with the duration information
            const addItem = await model.addItem(
               item_name,
               item_description,
               category_id,
               suggested_item,
               audioUrl,
               audioName,
               formatDuration(duration) // Pass the duration to the model
            );

            if (addItem) {
               return res.status(200).json({
                  status: 200,
                  message: "Success",
                  data: addItem
               });
            } else {
               return res.status(400).json({
                  status: 400,
                  message: "Bad request"
               });
            }
         });

      } catch (error) {
         console.log(error);
         res.status(500).json({
            status: 500,
            message: "Interval Server Error"
         })
      }
   },

   UPDATE_ITEM: async (req, res) => {
      try {
         const uploadPhoto = req.file;
         const { item_id, item_name, item_description, category_id, suggested_item } = req.body
         const foundItem = await model.foundItem(item_id);
         let audioUrl = '';
         let audioName = '';

         if (foundItem) {
            if (uploadPhoto) {
               // If there's an uploaded file, handle it
               if (foundItem?.item_audio_name) {
                  // Delete old audio file if it exists
                  const deleteOldAvatar = new FS(path.resolve(__dirname, '..', '..', '..', 'public', 'images', `${foundItem?.item_audio_name}`))
                  deleteOldAvatar.delete()
               }
               // Get the path of the uploaded MP3 file
               const filePath = uploadPhoto.path;

               // Get the duration of the MP3 file
               mp3Duration(filePath, async function (err, duration) {
                  if (err) {
                     console.error('Error getting MP3 duration:', err);
                     // If there's an error getting the duration, respond with an error
                     return res.status(500).json({
                        status: 500,
                        message: "Error getting MP3 duration"
                     });
                  }

                  // Set audioUrl and audioName
                  audioUrl = `${process.env.BACKEND_URL}/${uploadPhoto.filename}`;
                  audioName = uploadPhoto.filename;

                  // Call your model to update the item with the new audio information
                  const updateItem = await model.updateItem(
                     item_id,
                     item_name,
                     item_description,
                     category_id,
                     suggested_item,
                     audioUrl,
                     audioName,
                     formatDuration(duration) // Pass the duration to the model
                  );

                  if (updateItem) {
                     return res.status(200).json({
                        status: 200,
                        message: "Success",
                        data: updateItem
                     });
                  } else {
                     return res.status(400).json({
                        status: 400,
                        message: "Bad request"
                     });
                  }
               });
            } else {
               // If there's no uploaded file, update the item with existing audio information
               audioUrl = foundItem?.item_audio_url;
               audioName = foundItem?.item_audio_name;

               const updateItem = await model.updateItem(
                  item_id,
                  item_name,
                  item_description,
                  category_id,
                  suggested_item,
                  audioUrl,
                  audioName,
                  foundItem?.item_time
               );

               if (updateItem) {
                  return res.status(200).json({
                     status: 200,
                     message: "Success",
                     data: updateItem
                  });
               } else {
                  return res.status(400).json({
                     status: 400,
                     message: "Bad request"
                  });
               }
            }
         } else {
            return res.status(404).json({
               status: 404,
               message: "Not found"
            });
         }
      } catch (error) {
         console.log(error);
         res.status(500).json({
            status: 500,
            message: "Internal Server Error"
         });
      }
   },

   DELETE_CATEGORY: async (req, res) => {
      try {
         const { item_id } = req.body
         const foundItem = await model.foundItem(item_id)

         if (foundItem) {
            if (foundItem?.item_audio_name) {
               const deleteOldAvatar = new FS(path.resolve(__dirname, '..', '..', '..', 'public', 'images', `${foundItem?.item_audio_name}`))
               deleteOldAvatar.delete()
            }

            const deleteItem = await model.deleteItem(item_id)

            if (deleteItem) {
               return res.status(200).json({
                  status: 200,
                  message: "Success",
                  data: deleteItem
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