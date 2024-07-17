const { fetch } = require('../../lib/postgres')

const foundPayment = (text) => {
   const QUERY = `
      SELECT
         *
      FROM
         payment_categories
      WHERE
         category_name ilike '%${text}%';
   `;

   return fetch(QUERY)
}
const editUserPremium = (param2, timestamp, payment_type) => {
   const QUERY = `
      UPDATE
         users
      SET
         user_premium = true,
         user_premium_expires_at = $2,
         payment_type = $3
      WHERE
         user_id = $1
      RETURNING *;
   `;

   return fetch(QUERY, param2, timestamp, payment_type)
}
const addTransId = (
   user_id,
   user_token,
   transId,
   monthToAdd,
   amount
) => {
   const QUERY = `
      INSERT INTO
         uzum (
            user_id,
            user_token,
            trans_id,
            expires_month,
            amount
         ) VALUES (
            $1,
            $2,
            $3,
            $4,
            $5 
         ) RETURNING *;
   `;

   return fetch(
      QUERY,
      user_id,
      user_token,
      transId,
      monthToAdd,
      amount
   )
}

module.exports = {
   foundPayment,
   editUserPremium,
   addTransId
}