const { fetch } = require('../../lib/postgres')

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
const editUserPremium = (token, timestamp, payment_type) => {
   const QUERY = `
      UPDATE
         users
      SET
         user_premium = true,
         user_premium_expires_at = $2,
         payment_type = $3
      WHERE
         $1 = ANY (user_token)
      RETURNING *;
   `;

   return fetchALL(QUERY, token, timestamp, payment_type)
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
   foundUser,
   foundPayment,
   editUserPremium,
   addTransId
}