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

   return fetch(QUERY,date)
}

module.exports = {
   foundUser,
   updatedUserPhone,
   addMessage,
   foundMsg
}