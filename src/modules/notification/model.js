const { fetch } = require('../../lib/postgres')

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

module.exports = {
   foundUser
}