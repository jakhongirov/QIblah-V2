require('dotenv').config();
const model = require('./model')
const path = require('path')
const FS = require('../../lib/fs/fs')
const fs = require('fs')
const mp3Duration = require('mp3-duration');
const axios = require('axios');

async function getMp3Duration(filePathOrUrl) {
   let filePath;

   if (filePathOrUrl.startsWith('http://') || filePathOrUrl.startsWith('https://')) {
      // It's a URL, download the file
      const response = await axios({
         url: filePathOrUrl,
         method: 'GET',
         responseType: 'stream'
      });

      // Save the downloaded file to a temporary location
      filePath = './temp.mp3';
      const writer = fs.createWriteStream(filePath);

      response.data.pipe(writer);

      await new Promise((resolve, reject) => {
         writer.on('finish', resolve);
         writer.on('error', reject);
      });
   } else {
      // It's a local file path
      filePath = filePathOrUrl;
   }

   return new Promise((resolve, reject) => {
      mp3Duration(filePath, (err, duration) => {
         if (err) {
            reject(err);
         } else {
            resolve(duration);
         }

         // If we downloaded a file, remove the temporary file
         if (filePathOrUrl.startsWith('http://') || filePathOrUrl.startsWith('https://')) {
            fs.unlink(filePath, (err) => {
               if (err) console.error('Error deleting temporary file:', err);
            });
         }
      });
   });
}

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

   DOWNLOAD: async (req, res) => {
      try {
         const data = await model.download()

         res.setHeader('Content-Disposition', 'attachment; filename=my_table_data.json');
         res.setHeader('Content-Type', 'application/json');

         // Send JSON data as file download
         res.send(JSON.stringify(data, null, 2));
      } catch (error) {
         console.error('Error fetching data:', error);
         res.status(500).send('Error fetching data');
      }
   },

   ADD_ITEM_FILE: async (req, res) => {
      try {
         const data = new FS(path.resolve(__dirname, '..', '..', '..', 'files', `calmItemsDb.json`))
         const file = JSON.parse(data.read())

         for (const item of file) {
            const audioFileName = item?.audioLink?.split("https://server.qiblah.app/public/images/")[1]; // Get the file name
            const audioPath = path.resolve(__dirname, '..', '..', '..', 'public', 'images', audioFileName); // Construct the full path
            const duration = await getMp3Duration(audioPath);
            console.log(item?.name)

            await model.addItem(
               item?.name,
               "Ahmad Al Shalabi",
               item?.catid,
               item?.suggested,
               item?.audioLink,
               item?.audioLink?.split('/')[item?.audioLink?.split('/')?.length - 1],
               formatDuration(duration) // Pass the duration to the model
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
            message: "Internal Server Error"
         });
      }
   },

   ADD_ITEM: async (req, res) => {
      try {
         const uploadPhoto = req.file;
         const { item_name, category_id, item_description, suggested_item, audio_link } = req.body;
         const audioUrl = audio_link ? audio_link : `${process.env.BACKEND_URL}/${uploadPhoto?.filename}`;
         const audioName = audio_link ? null : uploadPhoto?.filename;
         const filePath = audio_link ? audio_link : uploadPhoto.path;

         const duration = await getMp3Duration(filePath);

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

      } catch (error) {
         console.log(error);
         res.status(500).json({
            status: 500,
            message: "Internal Server Error"
         });
      }
   },

   UPDATE_ITEM: async (req, res) => {
      try {
         const uploadPhoto = req.file;
         const { item_id, item_name, item_description, category_id, suggested_item, audio_link } = req.body;
         const foundItem = await model.foundItem(item_id);
         let audioUrl = '';
         let audioName = '';

         if (foundItem) {
            if (uploadPhoto) {
               // If there's an uploaded file, handle it
               if (foundItem?.item_audio_name) {
                  // Delete old audio file if it exists
                  const deleteOldAvatar = path.resolve(__dirname, '..', '..', 'public', 'images', `${foundItem?.item_audio_name}`);
                  fs.unlink(deleteOldAvatar, (err) => {
                     if (err) console.error('Error deleting old audio file:', err);
                  });
               }
               // Get the path of the uploaded MP3 file
               const filePath = uploadPhoto.path;

               // Get the duration of the MP3 file
               const duration = await getMp3Duration(filePath);

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
            } else if (audio_link) {
               const duration = await getMp3Duration(audio_link);

               audioUrl = audio_link;
               audioName = null;

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