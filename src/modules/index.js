const express = require("express")
const router = express.Router()

//Middlawares
const { AUTH } = require('../middleware/auth')
const { PAYME_CHECK_TOKEN, PAYME_ERROR } = require('../middleware/payme')
const FileUpload = require('../middleware/multer')

// files
const admin = require('./admin/admin')
const users = require('./users/users')
const usersStats = require('./userStats/userStats')
const priceList = require('./priceList/priceList')
const categories = require('./categories/categories')
// const questions = require('./questions/questions')
const names = require('./names/names')
const quran = require('./quran/quran')
const verses = require('./verses/verses')
const authors = require('./authors/authors')
const audios = require('./audios/audios')
const zikrs = require('./zikr/zikr')
const publicZikrs = require('./publicZikr/publicZikr')
const news = require('./news/news')
const tapes = require('./tapes/tapes')
const versions = require('./versions/versions')
const meditationCategories = require('./meditation/categories')
const meditationItems = require('./meditation/items')
const additionalVotes = require('./votes/votes')
const mapKey = require('./map/map')
const click = require('./click/click')
const paymentCategories = require('./payment/payment')
const paymentCheck = require('./payment/check')
const uzum = require('./uzum/uzum')
const transactions = require('./transactions/transactions')
const payme = require('./payme/payme')
const notification = require('./notification/notification')

router

  // ADMIN API
  /** 
   * @swagger
   * components: 
   *     schemas: 
   *       Admin:
   *          type: object
   *          required: 
   *             - admin_email
   *             - admin_password
   *          properties:
   *             admin_id: 
   *                type: string
   *                description: auto generate
   *             admin_email: 
   *                type: string
   *                description: admin's email
   *             admin_password:
   *                type: string
   *                description: admin put password for login and it hashing
   *             admin_create_at:
   *                type: string
   *                description: admin created date
   *          example:
   *             admin_id: 1
   *             admin_email: diyor.jakhongirov@gmail.com
   *             admin_password: 2jk3jnnj3nj43nb4j3bjeb3b23j
   *             admin_create_at: 2024-01-23 10:52:41 +0000
  */

  /**
   * @swagger
   * tags:
   *    name: Admin
   *    description: Admin managing API
   */

  /**
   * @swagger
   * /admin/list:
   *   get:
   *     summary: Returns the list of all the admins for Frontend developer
   *     tags: [Admin]
   *     security:
   *       - token: []
   *     parameters:
   *        - in: query
   *          name: limit
   *          schema:
   *             type: number
   *          description: limit of list
   *        - in: query
   *          name: page
   *          schema:
   *             type: number
   *          description: page of list
   *     responses:
   *       '200':
   *          description: The list of the admins
   *          content:
   *             application/json:
   *                schema:
   *                type: array
   *                items:
   *                   $ref: '#/components/schemas/Admin'
   *          headers:
   *             token:
   *                description: Token for authentication
   *                schema:
   *                type: string
   *       '500':
   *          description: Some server error
   */

  .get('/admin/list', AUTH, admin.GET_ADMIN)

  /**
   * @swagger
   * /admin/register:
   *    post:
   *       summary: Register new admin for Frontend developer
   *       tags: [Admin]
   *       requestBody:
   *          required: true
   *          content: 
   *             application/json:
   *                schema:
   *                   $ref: '#/components/schemas/Admin'
   *       responses:
   *          200:
   *             description: Created new admin
   *             content:
   *                application/json:
   *                   schema:
   *                      $ref: '#/components/schemas/Admin'
   *          500:
   *             description: Some server error
   */

  .post('/admin/register', admin.REGISTER_ADMIN)

  /**
   * @swagger
   * /admin/login:
   *    post:
   *       summary: Login admin for Frontend developer
   *       tags: [Admin]
   *       requestBody:
   *          required: true
   *          content:
   *             application/json:
   *                schema:
   *                   $ref: '#/components/schemas/Admin'
   *       responses:
   *          200:
   *             description: You logined
   *             content: 
   *                application/json:
   *                   schema:
   *                      $ref: '#/components/schemas/Admin' 
   *          500:
   *             description: Server error
   */

  .post('/admin/login', admin.LOGIN_ADMIN)

  /**
   * @swagger
   * /admin/edit:
   *    put:
   *       summary: Change admin's email and password for Frontend developer
   *       tags: [Admin]
   *       security:
   *          - token: []
   *       requestBody:
   *          required: true
   *          content:
   *             application/json:
   *                schema:
   *                   $ref: '#/components/schemas/Admin'
   *       responses:
   *          200:
   *             description: Changed data
   *             content: 
   *                application/json:
   *                   schema:
   *                      $ref: '#/components/schemas/Admin' 
   *             headers:
   *                token:
   *                   description: Token for authentication
   *                   schema:
   *                   type: string
   *          500:
   *             description: Server error
   */

  .put('/admin/edit', AUTH, admin.EDIT_ADMIN)

  /**
   * @swagger
   * /admin/delete:
   *    delete:
   *       summary: Delete admin for Frontend developer
   *       tags: [Admin]
   *       security:
   *          - token: []
   *       requestBody:
   *          required: true
   *          content:
   *             application/json:
   *                schema:
   *                   $ref: '#/components/schemas/Admin'
   *       responses:
   *          200:
   *             description: Deleted admin
   *             content: 
   *                application/json:
   *                   schema:
   *                      $ref: '#/components/schemas/Admin' 
   *             headers:
   *                token:
   *                   description: Token for authentication
   *                   schema:
   *                   type: string
   *          500:
   *             description: Server error
   */

  .delete('/admin/delete', AUTH, admin.DELETE_ADMIN)

  // USERS API
  /** 
   * @swagger
   * components: 
   *     schemas: 
   *       User:
   *          type: object
   *          required: 
   *             - user_name
   *             - user_gender
   *          properties:
   *             user_id: 
   *                type: string
   *                description: auto generate
   *             user_phone_number: 
   *                type: string
   *                description: user's phone number
   *             user_email: 
   *                type: string
   *                description: user's email
   *             user_password:
   *                type: string
   *                description: user put password for login and it hashing
   *             user_name:
   *                type: string
   *                description: user's name
   *             user_gender:
   *                type: string
   *                description: user's gender
   *             user_signin_method:
   *                type: string
   *                description: user singined by google, yandex and e.t.c
   *             user_extra_auth_id:
   *                type: string
   *                description: google, yandex unique id
   *             user_country_code:
   *                type: string
   *                description: user location country code
   *             user_region:
   *                type: string
   *                description: user location region
   *             user_location_status:
   *                type: number
   *                description: location status (1,2,3)
   *             user_app_lang:
   *                type: number
   *                description: user's app lang
   *             user_phone_model:
   *                type: array
   *                description: user's phones models
   *             user_phone_lang:
   *                type: array
   *                description: user's phones' lang
   *             user_os:
   *                type: array
   *                description: user's phones' os
   *             user_os_version:
   *                type: array
   *                description: user's phones' os version
   *             user_token:
   *                type: array
   *                description: user's token from app
   *             user_comment:
   *                type: array
   *                description: user's information
   *             user_premium:
   *                type: boolean
   *                description: user's premium status
   *             user_premium_expires_at:
   *                type: boolean
   *                description: user's premium expired date
   *             user_image_link:
   *                type: text
   *                description: user's profile image's link
   *             user_image_name:
   *                type: text
   *                description: user's profile image's name
   *             user_app_version:
   *                type: text
   *                description: app's version
   *             user_notification_id:
   *                type: text
   *                description: notification status
   *             user_notification:
   *                type: boolean
   *                description: notification status
   *             user_create_at:
   *                type: string
   *                description: user created date
   *          example:
   *             admin_id: 1
   *             admin_email: diyor.jakhongirov@gmail.com
   *             admin_password: 2jk3jnnj3nj43nb4j3bjeb3b23j
   *             admin_create_at: 2024-01-23 10:52:41 +0000
  */

  /**
   * @swagger
   * tags:
   *    name: User
   *    description: User managing API
   */

  /**
* @swagger
* /users/list:
*   get:
*     summary: Returns the list of all the users for Frontend developer
*     tags: [User]
*     security:
*       - token: []
*     parameters:
*        - in: query
*          name: limit
*          schema:
*             type: number
*          description: limit of list
*        - in: query
*          name: page
*          schema:
*             type: number
*          description: page of list
*     responses:
*       '200':
*          description: The list of the users
*          content:
*             application/json:
*                schema:
*                type: array
*                items:
*                   $ref: '#/components/schemas/User'
*          headers:
*             token:
*                description: Token for User
*                schema:
*                type: string
*       '500':
*          description: Some server error
*/

  .get('/users/list', AUTH, users.GET_ADMIN)
  .get('/users/count', AUTH, users.GET_USER_COUNT)
  .get('/users/premium/list', AUTH, users.GET_PREMIUM_USERS)
  .get('/user/:id', users.GET_ID)
  .get('/user/admin/:id', users.GET_ID_ADMIN)
  .get('/user/token/:token', users.GET_TOKEN)
  .post('/user/search', users.GET_SEARCH)
  .post('/user/register', users.REGISTER_USER)
  .post('/user/register/temporaryuser', users.TEMPORARY_USER)
  .post('/user/login/:contact', users.LOGIN_USER)
  .put('/user/edit/avatar/:user_id', AUTH, FileUpload.single("photo"), users.EDIT_USER_AVATAR)
  .put('/user/edit/contact', AUTH, users.EDIT_USER_CONTACT)
  .put('/user/edit/password', AUTH, users.EDIT_USER_PASSWORD)
  .put('/user/edit/name', AUTH, users.EDIT_USER_NAME)
  .put('/user/edit/location', AUTH, users.EDIT_USER_LOCATION)
  .put('/user/edit/phone-details', AUTH, users.EDIT_USER_PHONE_DETAILS)
  .put('/user/edit/about', AUTH, users.EDIT_USER_COMMENT)
  .put('/user/edit/premium', AUTH, users.EDIT_USER_PREMIUM)
  .put('/user/edit/applang', AUTH, users.CHANGE_LANG)
  .put('/user/edit/alldata', AUTH, users.EDIT_ALL_USER_DATE)
  .put('/user/edit/alldata/token', AUTH, users.EDIT_ALL_USER_DATE_TOKEN)
  .delete('/user/delete', AUTH, users.DELETE_USER)
  .delete('/user/admin/delete', AUTH, users.DELETE_USER_ADMIN)

  // USERS STATS API
  .get("/users/stats/list", AUTH, usersStats.GET_ADMIN)
  .get("/user/stats/:user_id", AUTH, usersStats.GET_USER_ID)
  .post("/user/stats/add", AUTH, usersStats.CREATE_USER_STATS)
  .delete("/user/stats/delete", AUTH, usersStats.DELETE_USER_STATS)

  // PRICE ITEM API
  .get('/prices/admin/list', AUTH, priceList.GET_ADMIN)
  .get('/prices/list', priceList.GET)
  .get('/prices/:id', priceList.GET_ID)
  .post('/price/item/add', AUTH, priceList.ADD_PRICE_ITEM)
  .put('/price/item/edit', AUTH, priceList.EDIT_PRICE_ITEM)
  .delete('/price/item/delete', AUTH, priceList.DELETE_PRICE_ITEM)

  // CATEGORIES API
  .get('/categories/list', categories.GET)
  .get('/category/:id', categories.GET_ID)
  .get('/category/file/add', AUTH, categories.ADD_FILE)
  .post('/category/add', FileUpload.single("photo"), AUTH, categories.ADD_CATEGORY)
  .put('/category/edit', FileUpload.single("photo"), AUTH, categories.EDIT_CATEGORY)
  .delete('/category/delete', AUTH, categories.DELETE_CATEGORY)

  // ZIKRS API
  .get('/zikr/list', zikrs.GET)
  .get('/zikr/:id', zikrs.GET_ID)
  .get('/zikr/file/add', AUTH, zikrs.ADD_FILE)
  .post('/zikr/add', AUTH, FileUpload.single("audio"), zikrs.ADD_ZIKR)
  .put('/zikr/edit', AUTH, FileUpload.single("audio"), zikrs.EDIT_ZIKR)
  .delete('/zikr/delete', AUTH, zikrs.DElETE_ZIKR)

  // PUBLIC ZIKRS API
  .get('/public/zikr/list', publicZikrs.GET)
  .get('/public/zikr/:id', publicZikrs.GET_ID)
  .post('/public/zikr/add', FileUpload.single("audio"), AUTH, publicZikrs.ADD_PUBLIC_ZIKR)
  .put('/public/zikr/edit', FileUpload.single("audio"), AUTH, publicZikrs.EDIT_PUBLIC_ZIKR)
  .put('/public/zikr/edit/participants', publicZikrs.EDIT_PARTICIPANTS)
  .put('/public/zikr/edit/count/:id', publicZikrs.EDIT_COUNT)
  .put('/public/zikr/edit/finishing', AUTH, publicZikrs.EDIT_FINISHING)
  .delete('/public/zikr/delete', AUTH, publicZikrs.DELETE_PUBLIC_ZIKR)

  // // QUESTION API
  // .get('/questions/list', AUTH, questions.GET)
  // .get('/questions/category/:categoryId', questions.GET_CATEGORY)
  // .get('/question/:id', questions.GET_ID)
  // .post('/question/add', AUTH, questions.ADD_QUESTION)
  // .put('/question/edit', AUTH, questions.EDIT_QUESTION)
  // .delete('/question/delete', AUTH, questions.DELETE_QUESTION)

  // NAMES API
  .get('/names/list', names.GET)
  .get('/name/:id', names.GET_ID)
  .get('/name/file/add', AUTH, names.ADD_FILE)
  .post('/name/add', AUTH, FileUpload.single("audio"), names.ADD_NAME)
  .put('/name/edit', AUTH, FileUpload.single("audio"), names.EDIT_NAME)
  .delete('/name/delete', AUTH, names.DELETE_NAME)

  // QURAN API
  .get('/quran/list', quran.GET)
  .get('/sura/:id', quran.GET_ID)
  .get('/sura/file/add', AUTH, quran.ADD_FILE)
  .post('/sura/add', AUTH, quran.ADD_SURA)
  .put('/sura/edit', AUTH, quran.EDIT_SURA)
  .delete('/sura/delete', quran.DELETE_SURA)

  // VERSES API
  .get('/verses/list', verses.GET)
  .get('/verses/list/:suraId', verses.GET_SURA)
  .get('/verses/:id', verses.GET_ID)
  .get('/verses/juz/:number', verses.GET_JUZ)
  .get('/verses/file/add', verses.ADD_FILE)
  .post('/verses/add', AUTH, verses.ADD_VERSE)
  .put('/verses/edit', AUTH, verses.EDIT_VERSE)
  .delete('/verses/delete', AUTH, verses.DELETE_VERSE)

  // AUTHORS API
  .get('/authors/list', authors.GET)
  .post('/author/add', AUTH, FileUpload.single("photo"), authors.ADD_AUTHOR)
  .put('/author/edit', AUTH, FileUpload.single("photo"), authors.UPDATE_AUTHOR)
  .delete('/author/delete', AUTH, authors.DELETE_AUTHOR)

  // AUDIOS API
  .get('/audios/list', audios.GET)
  .get('/audio/:sura_id', audios.GET_SURA_ID)
  .post('/audio/add', AUTH, FileUpload.single("audio"), audios.ADD_AUDIO)
  .put('/audio/edit', AUTH, FileUpload.single("audio"), audios.UPDATE_AUDIO)
  .delete('/audio/delete', AUTH, audios.DELETE_AUDIO)

  // NEWS API
  .get('/news/admin/list', AUTH, news.GET_ADMIN)
  .get('/news/list', news.GET)
  .get('/news/:id', news.GET_ID)
  .post('/news/add', AUTH, FileUpload.single("photo"), news.ADD_NEWS)
  .put('/news/edit', AUTH, FileUpload.single("photo"), news.EDIT_NEWS)
  .put('/news/like', news.EDIT_LIKE_COUNT)
  .put('/news/view', news.EDIT_VIEW_COUNT)
  .put('/news/edit/status', AUTH, news.EDIT_STATUS)
  .delete('/news/delete', AUTH, news.DELETE_NEWS)

  // TAPES API
  .get('/tapes/list', tapes.GET)
  .get('/tapes/date', tapes.GET_BY_DATE)
  .get('/tapes/:id', tapes.GET_ID)
  .post('/tapes/add', AUTH, tapes.ADD_TAPE)
  .put('/tapes/edit', AUTH, tapes.EDIT_TYPE)
  .delete('/tapes/delete', AUTH, tapes.DELETE_TAPE)

  // VERSIONS API
  .get('/quran/updated/list', AUTH, versions.GET_ADMIN)
  .post('/quran/updated', versions.GET_UPDATES)
  .post('/quran/updated/add', AUTH, versions.ADD_UPDATED)
  .put('/quran/updated/edit', AUTH, versions.UPDATE_UPDATES)
  .delete('/quran/updated/delete', AUTH, versions.DELETE_QURAN_UPDATES)
  .get('/versions/list', versions.GET_VERSION)
  .post('/versions/add', AUTH, versions.ADD_VERSION)
  .put('/versions/edit', AUTH, versions.UPDATE_VERSION)
  .delete('/versions/delete', AUTH, versions.DELETE_VERSION)

  // MEDITATION CATEGORIES
  .get('/meditation/categories', meditationCategories.GET)
  .post('/meditation/category/add', AUTH, meditationCategories.ADD_CATEGORY)
  .put('/meditation/category/edit', AUTH, meditationCategories.UPDATE_CATEGORY)
  .delete('/meditation/category/delete', AUTH, meditationCategories.DELETE_CATEGORY)

  // MEDITATION ITEMS
  .get('/meditation/items/admin', AUTH, meditationItems.GET_ADMIN)
  .get('/meditation/items', meditationItems.GET_CATEGORIES)
  .post('/meditation/item/add', AUTH, FileUpload.single("audio"), meditationItems.ADD_ITEM)
  .put('/meditation/item/edit', AUTH, FileUpload.single("audio"), meditationItems.UPDATE_ITEM)
  .delete('/meditation/item/delete', AUTH, meditationItems.DELETE_CATEGORY)

  // ADDITIONAL VOTES
  .get('/additional/votes', additionalVotes.GET)
  .post('/additional/vote/add', AUTH, FileUpload.fields([{ name: "audio" }, { name: "icon" }]), additionalVotes.ADD_VOTE)
  .put('/additional/vote/edit', AUTH, FileUpload.fields([{ name: "audio" }, { name: "icon" }]), additionalVotes.UPDATE_VOTE)
  .delete('/additional/vote/delete', AUTH, additionalVotes.DELETE_VOTE)

  // MAP KEY
  .get('/map/key/list', AUTH, mapKey.GET_LIST)
  .get('/map/key/random', mapKey.GET_RANDOM)
  .post('/map/key/add', AUTH, mapKey.ADD_KEY)
  .delete('/map/key/delete', AUTH, mapKey.DELETE_KEY)

  // CLICK
  .post('/click/prepare', click.Prepare)
  .post('/click/complete', click.Complete)

  //PAYMENT CATEGORIES
  .get('/payment/categories', paymentCategories.GET)
  .post('/payment/category/add', AUTH, paymentCategories.POST)
  .put('/payment/category/edit', AUTH, paymentCategories.PUT)
  .delete('/payment/category/delete', AUTH, paymentCategories.DELETE)

  // PAYMENT CHECK
  .get('/payment/check/:user_id', paymentCheck.GET)

  // UZUM
  .post('/uzum/check', uzum.CHECK)
  .post('/uzum/confirm', uzum.CONFIRM)
  .post('/uzum/create', uzum.CREATE)
  .post('/uzum/reverse', uzum.REVERSE)
  .post('/uzum/status', uzum.STATUS)

  //Transactions
  .get("/transactions", AUTH, transactions.GET)

  // PAYME
  .post('/payme', PAYME_CHECK_TOKEN, payme.PAYMENT)

  // NOTIFICATION
  .post('/send/notification', AUTH, notification.SEND)

module.exports = router