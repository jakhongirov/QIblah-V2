const { fetch } = require('../../lib/postgres')

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

const addTransaction = (
   click_trans_id,
   amount,
   param3,
   param2,
   merchant_trans_id,
   error,
   error_note
) => {
   const QUERY = `
      INSERT INTO
         transactions (
            click_id,
            amount,
            expires_month,
            user_id,
            merchant_id,
            error,
            error_note
         ) VALUES (
            $1,
            $2,
            $3,
            $4,
            $5,
            $6,
            $7
         ) RETURNING *;
   `;

   return fetch(
      QUERY,
      click_trans_id,
      amount,
      param2,
      param3,
      merchant_trans_id,
      error,
      error_note
   )
}
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

module.exports = {
   editUserPremium,
   addTransaction,
   foundPayment
}