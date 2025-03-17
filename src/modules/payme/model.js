const { fetch, fetchALL } = require('../../lib/postgres')

const foundUser = (user_id) => {
   const QUERY = `
      SELECT
         *
      FROM
         users
      WHERE
         user_id = $1
   `;

   return fetch(QUERY, user_id)
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
const foundTransaction = (id) => {
   const QUERY = `
      SELECT
         *
      FROM
         payme
      WHERE
         transaction = $1;
   `;

   return fetch(QUERY, id)
};
const updateTransaction = (id, state, reason) => {
   const QUERY = `
      UPDATE
         payme
      SET
         state = $2,
         reason = $3
      WHERE
         transaction = $1
      RETURNING *;
   `;

   return fetch(QUERY, id, state, reason)
}
const addTransaction = (
   user_id,
   tarif,
   state,
   amount,
   id,
   time,
   user_token,
   ilova
) => {
   const QUERY = `
      INSERT INTO
         payme (
            user_id,
            payment,
            state,
            amount,
            transaction,
            create_time,
            user_token,
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
      tarif,
      state,
      amount,
      id,
      time,
      user_token,
      ilova
   )
};
const updateTransactionPerform = (
   id,
   state,
   reason,
   currentTime
) => {
   const QUERY = `
      UPDATE
         payme
      SET
         state = $2,
         reason = $3,
         cancel_time = $4
      WHERE
         transaction = $1
      RETURNING *;
   `;

   return fetch(
      QUERY,
      id,
      state,
      reason,
      currentTime
   )
}
const updateTransactionPaid = (
   id,
   state,
   currentTime
) => {
   const QUERY = `
      UPDATE
         payme
      SET
         state = $2,
         perform_time = $3
      WHERE
         transaction = $1
      RETURNING *;
   `;

   return fetch(
      QUERY,
      id,
      state,
      currentTime
   )
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

   return fetchALL(QUERY, token, timestamp, payment_type, tracking);
}
const updateTransactionState = (
   id,
   state,
   reason,
   currentTime
) => {
   const QUERY = `
      UPDATE
         payme
      SET
         state = $2,
         reason = $3,
         cancel_time = $4
      WHERE
         transaction = $1
      RETURNING *;
   `;

   return fetch(
      QUERY,
      id,
      state,
      reason,
      currentTime
   )
};

module.exports = {
   foundUser,
   foundPayment,
   foundTransaction,
   updateTransaction,
   addTransaction,
   updateTransactionPerform,
   updateTransactionPaid,
   editUserPremium,
   updateTransactionState
}