const { fetch, fetchALL } = require('../../lib/postgres')

const foundUser = async (id) => {
   const QUERY = `
     SELECT
       *
     FROM
       users
     WHERE
       user_id = $1;
   `;

   return await fetch(QUERY, id);
}
const editUserPremium = (user_token, timestamp, payment_type, tracking) => {
   const QUERY = `
      UPDATE
         users
      SET
         user_premium = true,
         user_premium_expires_at = $2,
         payment_type = $3,
         payment_tracking = array_append(payment_tracking, $4)
      WHERE
         $1 = ANY (user_token) 
      RETURNING *;
   `;

   return fetchALL(QUERY, user_token, timestamp, payment_type, tracking)
}

const addTransaction = (
   click_trans_id,
   amount,
   monthToAdd,
   param2,
   merchant_trans_id,
   error,
   error_note,
   token
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
            error_note,
            user_token
         ) VALUES (
            $1,
            $2,
            $3,
            $4,
            $5,
            $6,
            $7,
            $8
         ) RETURNING *;
   `;

   return fetch(
      QUERY,
      click_trans_id,
      amount,
      monthToAdd,
      param2,
      merchant_trans_id,
      error,
      error_note,
      token
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
   foundUser,
   editUserPremium,
   addTransaction,
   foundPayment
}