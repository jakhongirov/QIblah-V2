const model = require('./model')

module.exports = {
   GET_ADMIN: async (req, res) => {
      try {
         const { limit, page } = req.query

         if (limit && page) {
            const getAdminPriceList = await model.getAdminPriceList(limit, page)

            if (getAdminPriceList) {
               return res.status(200).json({
                  status: 200,
                  message: "Success",
                  data: getAdminPriceList
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

   GET: async (req, res) => {
      try {
         const { lang, limit, page } = req.query

         if (lang && limit && page) {
            const getPriceList = await model.getPriceList(lang, limit, page)

            if (getPriceList) {
               return res.status(200).json({
                  status: 200,
                  message: "Success",
                  data: getPriceList
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
               message: "Must write  lang, limit and page"
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
         const { lang } = req.query

         const foundPriceItem = await model.foundPriceItem(id, lang)

         if (foundPriceItem) {
            return res.status(200).json({
               status: 200,
               message: "Success",
               data: foundPriceItem
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

   ADD_PRICE_ITEM: async (req, res) => {
      try {
         const {
            price_yearly_dollar,
            price_yearly_sum,
            price_monthly_dollar,
            price_monthly_sum,
            comments,
            features_uzbek,
            features_cyrillic,
            features_russian,
            features_english,
            features_kazakh,
            privacy_policy_link,
            terms_condition_link,
            bot_link,
            email_link,
            price_item_ads,
            price_item_string,
            ads_country
         } = req.body

         const addPriceItem = await model.addPriceItem(
            price_yearly_dollar,
            price_yearly_sum,
            price_monthly_dollar,
            price_monthly_sum,
            comments,
            features_uzbek,
            features_cyrillic,
            features_russian,
            features_english,
            features_kazakh,
            privacy_policy_link,
            terms_condition_link,
            bot_link,
            email_link,
            price_item_ads,
            price_item_string,
            ads_country
         )

         if (addPriceItem) {
            return res.status(201).json({
               status: 201,
               message: "Created",
               data: addPriceItem
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

   EDIT_PRICE_ITEM: async (req, res) => {
      try {
         const {
            price_item_id,
            price_yearly_dollar,
            price_yearly_sum,
            price_monthly_dollar,
            price_monthly_sum,
            comments,
            features_uzbek,
            features_cyrillic,
            features_russian,
            features_english,
            features_kazakh,
            privacy_policy_link,
            terms_condition_link,
            bot_link,
            email_link,
            price_item_ads,
            price_item_string,
            ads_country
         } = req.body
         const foundPriceItem = await model.foundPriceItem(price_item_id)

         if (foundPriceItem) {
            const editPriceItem = await model.editPriceItem(
               price_item_id,
               price_yearly_dollar,
               price_yearly_sum,
               price_monthly_dollar,
               price_monthly_sum,
               comments,
               features_uzbek,
               features_cyrillic,
               features_russian,
               features_english,
               features_kazakh,
               privacy_policy_link,
               terms_condition_link,
               bot_link,
               email_link,
               price_item_ads,
               price_item_string,
               ads_country
            )

            if (editPriceItem) {
               return res.status(200).json({
                  status: 200,
                  message: "Success",
                  data: editPriceItem
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

   DELETE_PRICE_ITEM: async (req, res) => {
      try {
         const { price_item_id } = req.body
         const foundPriceItem = await model.foundPriceItem(price_item_id)

         if (foundPriceItem) {
            const deletePriceItem = await model.deletePriceItem(price_item_id)

            if (deletePriceItem) {
               return res.status(200).json({
                  status: 200,
                  message: "Success",
                  data: deletePriceItem
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