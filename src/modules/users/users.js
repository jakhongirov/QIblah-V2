require('dotenv').config();
const model = require('./model')
const JWT = require('../../lib/jwt')
const bcryptjs = require('bcryptjs')
const path = require('path')
const FS = require('../../lib/fs/fs')

function getCurrentTimeFormatted() {
   const now = new Date();
   const uzbekistanTime = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Tashkent',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
   }).format(now);

   // Split the formatted date and time
   const [date, time] = uzbekistanTime.split(', ');

   // Reformat date from dd/mm/yyyy to dd.mm.yyyy
   const [day, month, year] = date.split('/');

   return `${day}.${month}.${year} ${time}`;
}

module.exports = {
   GET_ADMIN: async (req, res) => {
      try {
         const { limit, page } = req.query

         if (limit && page) {
            const getAdminUsers = await model.getAdminUsers(limit, page)

            if (getAdminUsers) {
               return res.status(200).json({
                  status: 200,
                  message: "Success",
                  data: getAdminUsers
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

   GET_USER_COUNT: async (req, res) => {
      try {
         const userCount = await model.userCount()
         const userCountMale = await model.userCountMale()
         const userCountFemale = await model.userCountFemale()
         const userNotificationTrue = await model.userNotificationTrue()
         const userNotificationFalse = await model.userNotificationFalse()
         const userLocationStatus1 = await model.userLocationStatus1()
         const userLocationStatus2 = await model.userLocationStatus2()
         const userLocationStatus3 = await model.userLocationStatus3()
         const userPremium = await model.userPremium()

         if (userCount && userCountMale && userCountFemale) {
            return res.status(200).json({
               status: 200,
               message: "Success",
               data: {
                  all: userCount?.count,
                  male: userCountMale?.count,
                  female: userCountFemale?.count,
                  premium: userPremium?.count,
                  notificationTrue: userNotificationTrue?.count,
                  notificationFalse: userNotificationFalse?.count,
                  location_status: {
                     1: userLocationStatus1?.count,
                     2: userLocationStatus2?.count,
                     3: userLocationStatus3?.count
                  }
               }
            })
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

   GET_PREMIUM_USERS: async (req, res) => {
      try {
         const { limit, page } = req.query

         if (limit && page) {
            const getUserPremiumList = await model.getUserPremiumList(limit, page)

            if (getUserPremiumList?.length > 0) {
               return res.status(200).json({
                  status: 200,
                  message: "Success",
                  data: getUserPremiumList
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

   GET_ID_ADMIN: async (req, res) => {
      try {
         const { id } = req.params

         if (id) {
            const foundUser = await model.checkUserById(id)

            if (foundUser) {
               return res.status(200).json({
                  status: 200,
                  message: "Success",
                  data: foundUser
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
               message: "Must write user id"
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
         const { user_enter } = req.query

         if (id) {
            const foundUser = await model.checkUserById(id)

            if (foundUser) {
               if (user_enter === false) {
                  'User enter is false, no action performed';
               } else {
                  const currentTime = getCurrentTimeFormatted();
                  const addTracking = await model.addTracking(foundUser.user_id, currentTime);
                  addTracking;
               }

               return res.status(200).json({
                  status: 200,
                  message: "Success",
                  data: foundUser
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
               message: "Must write user id"
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

   GET_TOKEN: async (req, res) => {
      try {
         const { token } = req.params
         const { user_enter } = req.query

         if (token) {
            const foundUserByToken = await model.foundUserByToken(token)

            if (foundUserByToken) {

               if (user_enter === false) {
                  'User enter is false, no action performed';
               } else {
                  const currentTime = getCurrentTimeFormatted();
                  const addTracking = await model.addTracking(foundUserByToken.user_id, currentTime);
                  addTracking;
               }

               return res.status(200).json({
                  status: 200,
                  message: "Success",
                  data: foundUserByToken
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
               message: "Must write user id"
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

   GET_SEARCH: async (req, res) => {
      try {
         const { phone_number, user_name, user_gender } = req.body

         if (phone_number || user_name || user_gender) {
            const userSearch = await model.userSearch(phone_number, user_name, user_gender)

            if (userSearch) {
               return res.status(200).json({
                  status: 200,
                  message: "Success",
                  data: userSearch
               })
            } else {
               return res.status(404).json({
                  status: 404,
                  message: "Not found"
               })
            }

         } else {
            res.status(400).json({
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

   REGISTER_USER: async (req, res) => {
      try {
         const {
            user_phone_number,
            user_email,
            user_password,
            user_name,
            user_gender,
            user_signin_method,
            user_extra_auth_id,
            user_country_code,
            user_region,
            user_location,
            user_app_lang,
            user_phone_model,
            user_phone_lang,
            user_os,
            user_os_version,
            user_token,
            user_app_version,
            notification_id,
            notification,
            location_status,
            user_address_name
         } = req.body;
         const checkUserEmail = await model.checkUserEmail(user_email?.trim());
         const cleanedValue = user_phone_number.replace(/\s+/g, '');
         const checkUserPhoneNumber = await model.checkUserPhoneNumber(cleanedValue?.trim());


         if (checkUserEmail || checkUserPhoneNumber) {
            return res.status(302).json({
               status: 302,
               message: "User found"
            });
         } else {
            const pass_hash = await bcryptjs.hash(user_password, 10);
            const registerUser = await model.registerUser(
               cleanedValue,
               user_email,
               pass_hash,
               user_name,
               user_gender,
               user_signin_method,
               user_extra_auth_id,
               user_country_code,
               user_region,
               user_location,
               user_app_lang,
               user_phone_model,
               user_phone_lang,
               user_os,
               user_os_version,
               user_token,
               user_app_version,
               notification_id,
               notification,
               location_status == 'null' || location_status == null ? 0 : location_status,
               user_address_name
            );

            if (registerUser) {
               const token = await new JWT({ id: registerUser?.user_id }).sign();
               return res.status(201).json({
                  status: 201,
                  message: "Success",
                  data: registerUser,
                  token: token
               });
            } else {
               return res.status(400).json({
                  status: 400,
                  message: "Bad request"
               });
            }
         }
      } catch (error) {
         console.log(error);
         return res.status(500).json({
            status: 500,
            message: "Internal Server Error"
         });
      }
   },


   TEMPORARY_USER: async (req, res) => {
      try {
         const {
            user_name,
            user_gender,
            user_country_code,
            user_region,
            user_location,
            user_app_lang,
            user_phone_model,
            user_phone_lang,
            user_os,
            user_os_version,
            user_token,
            user_app_version,
            notification_id,
            notification,
            location_status,
            user_address_name
         } = req.body;

         // const foundUser = await model.foundUserByToken(user_token?.trim());
         // console.log('Found user by token:', foundUser, user_token);

         // if (foundUser) {
         //    const token = await new JWT({ id: foundUser.user_id }).sign();
         //    return res.status(200).json({
         //       status: 200,
         //       message: "Success",
         //       data: foundUser,
         //       token: token
         //    });
         // } else {
         const createTemporaryUser = await model.createTemporaryUser(
            user_name,
            user_gender,
            user_country_code,
            user_region,
            user_location,
            user_app_lang,
            user_phone_model,
            user_phone_lang,
            user_os,
            user_os_version,
            user_token,
            user_app_version,
            notification_id,
            notification,
            location_status === 'null' || location_status === null ? 0 : location_status,
            user_address_name
         );

         if (createTemporaryUser) {
            const token = await new JWT({ id: createTemporaryUser.user_id }).sign();
            return res.status(200).json({
               status: 200,
               message: "Success",
               data: createTemporaryUser,
               token: token
            });
         } else {
            return res.status(400).json({
               status: 400,
               message: "Bad request"
            });
         }
         // }
      } catch (error) {
         console.log(error);
         res.status(500).json({
            status: 500,
            message: "Internal Server Error"
         });
      }
   },

   LOGIN_USER: async (req, res) => {
      try {
         const { contact } = req.params

         if (contact == 'email') {
            const {
               user_email,
               user_password,
               user_token,
               user_app_version,
            } = req.body
            const checkUserEmail = await model.checkUserEmail(user_email)

            if (checkUserEmail) {
               const foundUserByToken = await model.foundUserByToken(user_token)
               const validPass = checkUserEmail?.user_password ? await bcryptjs.compare(user_password, checkUserPhoneNumber?.user_password) : ""

               if (validPass) {
                  if (user_token) {
                     const addToken = await model.addToken(
                        checkUserEmail?.user_id,
                        user_token,
                        user_app_version,
                        foundUserByToken?.user_premium ? foundUserByToken?.user_premium : checkUserEmail?.user_premium ? checkUserEmail?.user_premium : foundUserByToken?.user_premium,
                        foundUserByToken?.user_premium ? foundUserByToken?.payment_type : checkUserEmail?.user_premium ? checkUserEmail?.payment_type : foundUserByToken?.payment_type,
                        foundUserByToken?.user_premium ? foundUserByToken?.user_premium_expires_at : checkUserEmail?.user_premium ? checkUserEmail?.user_premium_expires_at : foundUserByToken?.user_premium_expires_at,
                        foundUserByToken?.user_country_code,
                        foundUserByToken?.user_region,
                        foundUserByToken?.user_location,
                        foundUserByToken?.user_address_name,
                        foundUserByToken?.user_location_status,
                        foundUserByToken?.tracking
                     )

                     const token = await new JWT({ id: checkUserEmail?.user_id }).sign()
                     await model.deleteUser(foundUserByToken?.user_id)
                     return res.status(200).json({
                        status: 200,
                        message: "Success",
                        data: addToken,
                        token: token
                     })
                  } else {
                     return res.status(400).json({
                        status: 400,
                        message: "Send token"
                     })
                  }
               } else {
                  return res.status(401).json({
                     status: 401,
                     message: "Invalid password"
                  })
               }

            } else {
               return res.status(404).json({
                  status: 404,
                  message: "User not found"
               })
            }
         } else if (contact == 'phone') {
            const {
               user_phone_number,
               user_password,
               user_token,
               user_app_version
            } = req.body
            const cleanedValue = user_phone_number.replace(/\s+/g, '');
            const checkUserPhoneNumber = await model.checkUserPhoneNumber(cleanedValue)

            if (checkUserPhoneNumber) {
               const foundUserByToken = await model.foundUserByToken(user_token)
               const validPass = checkUserPhoneNumber?.user_password ? await bcryptjs.compare(user_password, checkUserPhoneNumber?.user_password) : ""

               if (validPass) {
                  if (user_token) {
                     const addToken = await model.addToken(
                        checkUserPhoneNumber?.user_id,
                        user_token,
                        user_app_version,
                        foundUserByToken?.user_premium ? foundUserByToken?.user_premium : checkUserPhoneNumber?.user_premium ? checkUserPhoneNumber?.user_premium : foundUserByToken?.user_premium,
                        foundUserByToken?.user_premium ? foundUserByToken?.payment_type : checkUserPhoneNumber?.user_premium ? checkUserPhoneNumber?.payment_type : foundUserByToken?.payment_type,
                        foundUserByToken?.user_premium ? foundUserByToken?.user_premium_expires_at : checkUserPhoneNumber?.user_premium ? checkUserPhoneNumber?.user_premium_expires_at : foundUserByToken?.user_premium_expires_at,
                        foundUserByToken?.user_country_code,
                        foundUserByToken?.user_region,
                        foundUserByToken?.user_location,
                        foundUserByToken?.user_address_name,
                        foundUserByToken?.user_location_status,
                        foundUserByToken?.tracking
                     )
                     const token = await new JWT({ id: checkUserPhoneNumber?.user_id }).sign()
                     await model.deleteUser(foundUserByToken?.user_id)
                     return res.status(200).json({
                        status: 200,
                        message: "Success",
                        data: addToken,
                        token: token
                     })
                  } else {
                     return res.status(400).json({
                        status: 400,
                        message: "Send token"
                     })
                  }
               } else {
                  return res.status(401).json({
                     status: 401,
                     message: "Invalid password or you do not have"
                  })
               }

            } else {
               return res.status(404).json({
                  status: 404,
                  message: "User not found"
               })
            }
         } else if (contact == 'methods') {
            const {
               user_signin_method,
               user_extra_auth_id,
               user_token,
               user_app_version,
            } = req.body
            const checkUserMethod = await model.checkUserMethod(user_signin_method, user_extra_auth_id)

            if (checkUserMethod) {
               const foundUserByToken = await model.foundUserByToken(user_token)

               if (user_token) {
                  const addToken = await model.addToken(
                     checkUserMethod?.user_id,
                     user_token,
                     user_app_version,
                     foundUserByToken?.user_premium ? foundUserByToken?.user_premium : checkUserMethod?.user_premium ? checkUserMethod?.user_premium : foundUserByToken?.user_premium,
                     foundUserByToken?.user_premium ? foundUserByToken?.payment_type : checkUserMethod?.user_premium ? checkUserMethod?.payment_type : foundUserByToken?.payment_type,
                     foundUserByToken?.user_premium ? foundUserByToken?.user_premium_expires_at : checkUserMethod?.user_premium ? checkUserMethod?.user_premium_expires_at : foundUserByToken?.user_premium_expires_at,
                     foundUserByToken?.user_country_code,
                     foundUserByToken?.user_region,
                     foundUserByToken?.user_location,
                     foundUserByToken?.user_address_name,
                     foundUserByToken?.user_location_status,
                     foundUserByToken?.tracking
                  )
                  const token = await new JWT({ id: checkUserMethod?.user_id }).sign()
                  await model.deleteUser(foundUserByToken?.user_id)
                  return res.status(200).json({
                     status: 200,
                     message: "Success",
                     data: addToken,
                     token: token
                  })
               } else {
                  return res.status(400).json({
                     status: 400,
                     message: "Send token"
                  })
               }
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

   EDIT_USER_AVATAR: async (req, res) => {
      try {
         const { user_id } = req.params
         const uploadPhoto = req.file;
         const checkUser = await model.checkUserById(user_id)

         if (checkUser) {
            if (checkUser?.user_image_name) {
               const deleteOldAvatar = new FS(path.resolve(__dirname, '..', '..', '..', 'public', 'images', `${checkUser?.user_image_name}`))
               deleteOldAvatar.delete()
            }

            const imageUrl = `${process.env.BACKEND_URL}/${uploadPhoto?.filename}`;
            const imageName = uploadPhoto?.filename;
            const editUserAvatar = await model.editUserAvatar(user_id, imageUrl, imageName)

            if (editUserAvatar) {
               return res.status(200).json({
                  status: 200,
                  message: "Success",
                  data: editUserAvatar
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
               message: "User not found"
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

   EDIT_USER_CONTACT: async (req, res) => {
      try {
         const {
            user_id,
            user_email,
            user_phone_number,
            user_password
         } = req.body
         const checkUser = await model.checkUserById(user_id)

         if (checkUser) {
            const checkUserPhoneNumber = await model.checkUserPhoneNumber(user_phone_number)

            if (checkUserPhoneNumber) {
               return res.status(302).json({
                  status: 302,
                  message: "User found"
               });
            } else {
               if (user_password) {
                  const pass_hash = await bcryptjs.hash(user_password, 10)
                  const editUser = await model.editUser(user_id, user_email, user_phone_number, pass_hash)

                  if (editUser) {
                     return res.status(200).json({
                        status: 200,
                        message: "Success",
                        data: editUser
                     })
                  } else {
                     return res.status(400).json({
                        status: 400,
                        message: "Bad request"
                     })
                  }

               } else {
                  const editUser = await model.editUser(user_id, user_email, user_phone_number, checkUser?.user_password)

                  if (editUser) {
                     return res.status(200).json({
                        status: 200,
                        message: "Success",
                        data: editUser
                     })
                  } else {
                     return res.status(400).json({
                        status: 400,
                        message: "Bad request"
                     })
                  }
               }
            }
         } else {
            return res.status(404).json({
               status: 404,
               message: "User not found"
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

   EDIT_USER_PASSWORD: async (req, res) => {
      try {
         const {
            user_id,
            user_email,
            user_phone_number,
            user_password
         } = req.body
         const checkUser = await model.checkUserById(user_id)

         if (checkUser) {
            if (user_password) {
               const pass_hash = await bcryptjs.hash(user_password, 10)
               const editUser = await model.editUser(user_id, user_email, user_phone_number, pass_hash)

               if (editUser) {
                  return res.status(200).json({
                     status: 200,
                     message: "Success",
                     data: editUser
                  })
               } else {
                  return res.status(400).json({
                     status: 400,
                     message: "Bad request"
                  })
               }

            } else {
               const editUser = await model.editUser(user_id, user_email, user_phone_number, checkUser?.user_password)

               if (editUser) {
                  return res.status(200).json({
                     status: 200,
                     message: "Success",
                     data: editUser
                  })
               } else {
                  return res.status(400).json({
                     status: 400,
                     message: "Bad request"
                  })
               }
            }
         } else {
            return res.status(404).json({
               status: 404,
               message: "User not found"
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

   EDIT_USER_NAME: async (req, res) => {
      try {
         const { user_id, user_name, user_gender, user_phone_number } = req.body
         const checkUser = await model.checkUserById(user_id)

         if (checkUser) {
            const editUserName = await model.editUserName(user_id, user_name, user_gender, user_phone_number)

            if (editUserName) {
               return res.status(200).json({
                  status: 200,
                  message: "Success",
                  data: editUserName
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
               message: "User not found"
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

   EDIT_USER_LOCATION: async (req, res) => {
      try {
         const {
            user_id,
            user_location,
            user_region,
            user_country_code,
            location_status,
            user_address_name
         } = req.body
         const checkUser = await model.checkUserById(user_id)

         if (checkUser) {
            const editUserLocation = await model.editUserLocation(
               user_id,
               user_location,
               user_region,
               user_country_code,
               location_status == 'null' || location_status == null ? 0 : location_status,
               user_address_name
            )

            if (editUserLocation) {
               return res.status(200).json({
                  status: 200,
                  message: "Success",
                  data: editUserLocation
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
               message: "User not found"
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

   EDIT_USER_PHONE_DETAILS: async (req, res) => {
      try {
         const {
            user_id,
            user_phone_model,
            user_phone_lang,
            user_os,
            user_os_version,
         } = req.body
         const checkUser = await model.checkUserById(user_id)

         if (checkUser) {
            const editUserPhoneDetails = await model.editUserPhoneDetails(
               user_id,
               user_phone_model,
               user_phone_lang,
               user_os,
               user_os_version
            )

            if (editUserPhoneDetails) {
               return res.status(200).json({
                  status: 200,
                  message: "Success",
                  data: editUserPhoneDetails
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
               message: "User not found"
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

   EDIT_USER_COMMENT: async (req, res) => {
      try {
         const { user_id, user_comment } = req.body
         const checkUser = await model.checkUserById(user_id)

         if (checkUser) {
            const editUserAbout = await model.editUserAbout(user_id, user_comment)

            if (editUserAbout) {
               return res.status(200).json({
                  status: 200,
                  message: "Success",
                  data: editUserAbout
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
               message: "User not found"
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

   EDIT_USER_PREMIUM: async (req, res) => {
      try {
         const { user_id, user_premium, expires_at, payment_type } = req.body
         const checkUser = await model.checkUserById(user_id)

         if (checkUser) {
            if (user_premium) {
               const editUserPremium = await model.editUserPremium(user_id, user_premium, expires_at, payment_type)

               if (editUserPremium) {
                  return res.status(200).json({
                     status: 200,
                     message: "Success",
                     data: editUserPremium
                  })
               } else {
                  return res.status(400).json({
                     status: 400,
                     message: "Bad request"
                  })
               }

            } else {
               const editUserPremium = await model.editUserPremium(user_id, user_premium, checkUser?.user_premium_expires_at, payment_type)

               if (editUserPremium) {
                  return res.status(200).json({
                     status: 200,
                     message: "Success",
                     data: editUserPremium
                  })
               } else {
                  return res.status(400).json({
                     status: 400,
                     message: "Bad request"
                  })
               }

            }

         } else {
            return res.status(404).json({
               status: 404,
               message: "User not found"
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

   CHANGE_LANG: async (req, res) => {
      try {
         const { user_id, lang } = req.body
         const checkUser = await model.checkUserById(user_id)

         if (checkUser) {
            const changeLang = await model.changeLang(user_id, lang)

            if (changeLang) {
               return res.status(200).json({
                  status: 200,
                  message: "Success",
                  data: changeLang
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
               message: "User not found"
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

   EDIT_ALL_USER_DATE: async (req, res) => {
      try {
         const {
            user_id,
            user_name,
            user_gender,
            user_country_code,
            user_region,
            user_location,
            user_app_lang,
            user_phone_model,
            user_phone_lang,
            user_os,
            user_os_version,
            user_comment,
            user_qazo,
            verse_id,
            read_verse,
            name_count,
            zikr_id,
            zikr_count,
            user_app_version,
            user_address_name
         } = req.body
         const checkUserById = await model.checkUserById(user_id)
         const foundUserStat = await model.foundUserStat(user_id)

         if (checkUserById) {
            const updateUserAllData = await model.updateUserAllData(
               user_id,
               user_name,
               user_gender,
               user_country_code,
               user_region,
               user_location,
               user_app_lang,
               user_phone_model,
               user_phone_lang,
               user_os,
               user_os_version,
               user_comment,
               user_app_version,
               user_address_name
            )

            if (foundUserStat) {
               const editUserStats = await model.editUserStats(
                  user_id,
                  user_qazo,
                  verse_id,
                  read_verse,
                  name_count,
                  zikr_id,
                  zikr_count
               )

               if (editUserStats && updateUserAllData) {
                  for (const item of verse_id) {
                     await model.updateVerseFavCount(item)
                  }
                  for (const item of zikr_id) {
                     await model.updateZikrFavCount(item)
                  }

                  return res.status(200).json({
                     status: 200,
                     message: "Success",
                     data: {
                        user_stat: editUserStats,
                        user_data: updateUserAllData
                     }
                  })
               } else {
                  return res.status(200).json({
                     status: 400,
                     message: "Bad request"
                  })
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

               if (addUserStats && updateUserAllData) {
                  for (const item of verse_id) {
                     await model.updateVerseFavCount(item)
                  }
                  for (const item of zikr_id) {
                     await model.updateZikrFavCount(item)
                  }

                  return res.status(200).json({
                     status: 200,
                     message: "Success",
                     data: {
                        user_stat: addUserStats,
                        user_data: updateUserAllData
                     }
                  })
               } else {
                  return res.status(400).json({
                     status: 400,
                     message: "Bad request"
                  })
               }
            }
         } else {
            return res.status(404).json({
               status: 404,
               message: "User not found"
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

   DELETE_USER: async (req, res) => {
      try {
         const { user_id } = req.body
         const checkUser = await model.checkUserById(user_id)

         if (checkUser) {
            if (checkUser?.user_image_name) {
               const deleteOldAvatar = new FS(path.resolve(__dirname, '..', '..', '..', 'public', 'images', `${checkUser?.user_image_name}`))
               deleteOldAvatar.delete()
            }

            const deleteUser = await model.deleteUser(user_id)

            if (deleteUser) {
               return res.status(200).json({
                  status: 200,
                  message: "Success",
                  data: deleteUser
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
               message: "User not found"
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

   DELETE_USER_ADMIN: async (req, res) => {
      try {
         const { user_id } = req.body;

         const deletionPromises = user_id.map(async (id) => {
            const checkUser = await model.checkUserById(id);
            if (checkUser?.user_image_name) {
               const deleteOldAvatar = new FS(path.resolve(__dirname, '..', '..', '..', 'public', 'images', `${checkUser?.user_image_name}`))
               deleteOldAvatar.delete()// Delete old avatar image
            }
            return model.deleteUser(id);
         });

         await Promise.all(deletionPromises);

         return res.status(200).json({
            status: 200,
            message: "Success"
         });
      } catch (error) {
         console.log(error);
         return res.status(500).json({
            status: 500,
            message: "Internal Server Error"
         });
      }

   }
}