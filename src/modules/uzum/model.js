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
const editUserPremium = (token, timestamp, payment_type, tracking) => {
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

   return fetchALL(QUERY, token, timestamp, payment_type, tracking)
}
const addTransId = (
   user_id,
   user_token,
   transId,
   monthToAdd,
   amount,
   tarif,
   status,
   ilova
) => {
   const QUERY = `
      INSERT INTO
         uzum (
            user_id,
            user_token,
            trans_id,
            expires_month,
            amount,
            tarif,
            status,
            ilova
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
      user_id,
      user_token,
      transId,
      monthToAdd,
      amount,
      tarif,
      status,
      ilova
   )
}
const foundTrans = (transId) => {
   const QUERY = `
      SELECT
         *
      FROM
         uzum
      WHERE
         trans_id = $1
   `;

   return fetch(QUERY, transId)
}
const foundTransByUser = (user_id) => {
   const QUERY = `
      SELECT
         *
      FROM
         uzum
      WHERE
         user_id = $1
   `;

   return fetch(QUERY, user_id)
}
const editTrans = (id, status) => {
   const QUERY = `
      UPDATE
         uzum
      SET
         status = $2
      WHERE
         id = $1
      RETURNING *;
   `;

   return fetch(QUERY, id, status)
}

module.exports = {
   foundUser,
   foundPayment,
   editUserPremium,
   addTransId,
   foundTrans,
   foundTransByUser,
   editTrans
}