const { fetch, fetchALL } = require('../../lib/postgres')

const getAdminPriceList = (limit, page) => {
   const QUERY = `
      SELECT
         *
      FROM
         price_list
      ORDER BY
         price_item_id DESC
      LIMIT ${limit}
      OFFSET ${Number((page - 1) * limit)}
   `;

   return fetchALL(QUERY)
}
const getPriceList = (lang, limit, page) => {
   if (lang == 'uzbek') {
      const QUERY = `
         SELECT
            price_item_id,
            price_yearly_dollar,
            price_yearly_sum,
            price_monthly_dollar,
            price_monthly_sum,
            comments,
            features_uzbek AS features,
            privacy_policy_link,
            terms_condition_link,
            bot_link,
            email_link,
            price_item_ads,
            price_item_string,
            ads_country,
            price_item_create_at
         FROM
            price_list
         ORDER BY
            price_item_id DESC
         LIMIT ${limit}
         OFFSET ${Number((page - 1) * limit)}
      `;

      return fetchALL(QUERY)
   } else if (lang == 'cyrillic') {
      const QUERY = `
         SELECT
            price_item_id,
            price_yearly_dollar,
            price_yearly_sum,
            price_monthly_dollar,
            price_monthly_sum,
            comments,
            features_cyrillic AS features,
            privacy_policy_link,
            terms_condition_link,
            bot_link,
            email_link,
            price_item_ads,
            price_item_string,
            ads_country,
            price_item_create_at
         FROM
            price_list
         ORDER BY
            price_item_id DESC
         LIMIT ${limit}
         OFFSET ${Number((page - 1) * limit)}
      `;

      return fetchALL(QUERY)
   } else if (lang == 'russian') {
      const QUERY = `
         SELECT
            price_item_id,
            price_yearly_dollar,
            price_yearly_sum,
            price_monthly_dollar,
            price_monthly_sum,
            comments,
            features_russian AS features,
            privacy_policy_link,
            terms_condition_link,
            bot_link,
            email_link,
            price_item_ads,
            price_item_string,
            ads_country,
            price_item_create_at
         FROM
            price_list
         ORDER BY
            price_item_id DESC
         LIMIT ${limit}
         OFFSET ${Number((page - 1) * limit)}
      `;

      return fetchALL(QUERY)
   } else if (lang == 'english') {
      const QUERY = `
         SELECT
            price_item_id,
            price_yearly_dollar,
            price_yearly_sum,
            price_monthly_dollar,
            price_monthly_sum,
            comments,
            features_english AS features,
            privacy_policy_link,
            terms_condition_link,
            bot_link,
            email_link,
            price_item_ads,
            price_item_string,
            ads_country,
            price_item_create_at
         FROM
            price_list
         ORDER BY
            price_item_id DESC
         LIMIT ${limit}
         OFFSET ${Number((page - 1) * limit)}
      `;

      return fetchALL(QUERY)
   } else if (lang == 'kazakh') {
      const QUERY = `
         SELECT
            price_item_id,
            price_yearly_dollar,
            price_yearly_sum,
            price_monthly_dollar,
            price_monthly_sum,
            comments,
            features_kazakh AS features,
            privacy_policy_link,
            terms_condition_link,
            bot_link,
            email_link,
            price_item_ads,
            price_item_string,
            ads_country,
            price_item_create_at
         FROM
            price_list
         ORDER BY
            price_item_id DESC
         LIMIT ${limit}
         OFFSET ${Number((page - 1) * limit)}
      `;

      return fetchALL(QUERY)
   } else {
      const QUERY = `
         SELECT
            *
         FROM
            price_list
         ORDER BY
            price_item_id DESC
         LIMIT ${limit}
         OFFSET ${Number((page - 1) * limit)}
   `;

      return fetchALL(QUERY)
   }
}
const foundPriceItem = (id, lang) => {
   if (lang == 'uzbek') {
      const QUERY = `
         SELECT
            price_item_id,
            price_yearly_dollar,
            price_yearly_sum,
            price_monthly_dollar,
            price_monthly_sum,
            comments,
            features_uzbek AS features,
            privacy_policy_link,
            terms_condition_link,
            bot_link,
            email_link,
            price_item_ads,
            price_item_string,
            ads_country,
            price_item_create_at
         FROM
            price_list
         WHERE
            price_item_id = $1;
      `;

      return fetch(QUERY, id)
   } else if (lang == 'cyrillic') {
      const QUERY = `
         SELECT
            price_item_id,
            price_yearly_dollar,
            price_yearly_sum,
            price_monthly_dollar,
            price_monthly_sum,
            comments,
            features_cyrillic AS features,
            privacy_policy_link,
            terms_condition_link,
            bot_link,
            email_link,
            price_item_ads,
            price_item_string,
            ads_country,
            price_item_create_at
         FROM
            price_list
         WHERE
            price_item_id = $1;
      `;

      return fetch(QUERY, id)
   } else if (lang == 'russian') {
      const QUERY = `
         SELECT
            price_item_id,
            price_yearly_dollar,
            price_yearly_sum,
            price_monthly_dollar,
            price_monthly_sum,
            comments,
            features_russian AS features,
            privacy_policy_link,
            terms_condition_link,
            bot_link,
            email_link,
            price_item_ads,
            price_item_string,
            ads_country,
            price_item_create_at
         FROM
            price_list
         WHERE
            price_item_id = $1;
      `;

      return fetch(QUERY, id)
   } else if (lang == 'english') {
      const QUERY = `
         SELECT
            price_item_id,
            price_yearly_dollar,
            price_yearly_sum,
            price_monthly_dollar,
            price_monthly_sum,
            comments,
            features_english AS features,
            privacy_policy_link,
            terms_condition_link,
            bot_link,
            email_link,
            price_item_ads,
            price_item_string,
            ads_country,
            price_item_create_at
         FROM
            price_list
         WHERE
            price_item_id = $1
      `;

      return fetch(QUERY, id)
   } else if (lang == 'kazakh') {
      const QUERY = `
         SELECT
            price_item_id,
            price_yearly_dollar,
            price_yearly_sum,
            price_monthly_dollar,
            price_monthly_sum,
            comments,
            features_kazakh AS features,
            privacy_policy_link,
            terms_condition_link,
            bot_link,
            email_link,
            price_item_ads,
            price_item_string,
            ads_country,
            price_item_create_at
         FROM
            price_list
         WHERE
            price_item_id = $1
      `;

      return fetch(QUERY, id)
   } else {
      const QUERY = `
         SELECT
            *
         FROM
            price_list
         WHERE
            price_item_id = $1
   `;

      return fetch(QUERY, id)
   }
}
const addPriceItem = (
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
) => {
   const QUERY = `
      INSERT INTO
         price_list (
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
         ) VALUES (
            $1,
            $2,
            $3,
            $4,
            $5,
            $6,
            $7,
            $8,
            $9,
            $10,
            $11,
            $12,
            $13,
            $14,
            $15,
            $16,
            $17
         ) RETURNING *;
   `;

   return fetch(
      QUERY,
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
}
const editPriceItem = (
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
) => {
   const QUERY = `
      UPDATE
         price_list
      SET
         price_yearly_dollar = $2,
         price_yearly_sum = $3,
         price_monthly_dollar = $4,
         price_monthly_sum = $5,
         comments = $6,
         features_uzbek = $7,
         features_cyrillic = $8,
         features_russian = $9,
         features_english = $10,
         features_kazakh = $11,
         privacy_policy_link = $12,
         terms_condition_link = $13,
         bot_link = $14,
         email_link = $15,
         price_item_ads = $16,
         price_item_string = $17,
         ads_country = $18
      WHERE
         price_item_id = $1
      RETURNING *;
   `;

   return fetch(
      QUERY,
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
}
const deletePriceItem = (price_item_id) => {
   const QUERY = `
      DELETE FROM
         price_list
      WHERE
         price_item_id = $1
      RETURNING *;
   `;

   return fetch(QUERY, price_item_id)
}

module.exports = {
   getAdminPriceList,
   getPriceList,
   foundPriceItem,
   addPriceItem,
   editPriceItem,
   deletePriceItem
}