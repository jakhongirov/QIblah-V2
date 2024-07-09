const { fetch } = require('./src/lib/postgres')

const foundUser = (token) => {
   const QUERY = `
      SELECT
         *
      FROM
         users
      WHERE
         $1 = ANY (user_token);
   `;

   return fetch(QUERY, token)
}
const checkUser = (phoneNumber) => {
   const QUERY = `
      SELECT
         *
      FROM
         users
      WHERE
         user_phone_number = $1;
   `;

   return fetch(QUERY, phoneNumber)
}
const addToken = (id, token) => {
   const QUERY = `
      UPDATE
         users
      SET
         user_token = array_append(user_token, $2)
      WHERE
         user_id = $1
      RETURNING *;
   `;

   return fetch(QUERY, id, token)
}
const deleteUser = (id) => {
   const QUERY = `
      DELETE FROM
         users
      WHERE
         user_id = $1
      RETURNING *;
   `;

   return fetch(QUERY, id)
}
const updatedUserPhone = (id, phone_number) => {
   const QUERY = `
      UPDATE
         users
      SET
         user_phone_number = $2
      WHERE
         user_id = $1
      RETURNING *;
   `

   return fetch(QUERY, id, phone_number)
}
const updatedUserPassword = (user_id, pass_hash) => {
   const QUERY = `
      UPDATE
         users
      SET
         user_password = $2
      WHERE
         user_id = $1
      RETURNING *;
   `;

   return fetch(QUERY, user_id, pass_hash)
};
const addMessage = (chat_id, date) => {
   const QUERY = `
      INSERT INTO
         messages (
            chat_id,
            message_dete
         ) VALUES (
            $1,
            $2
         ) RETURNING *;
   `;

   fetch(QUERY, chat_id, date)
}
const foundMsg = (date) => {
   const QUERY = `
      SELECT
         *
      FROM
         messages
      WHERE
         message_dete = $1;
   `;

   return fetch(QUERY, date)
}

module.exports = {
   foundUser,
   checkUser,
   addToken,
   deleteUser,
   updatedUserPhone,
   updatedUserPassword,
   addMessage,
   foundMsg
}