const { fetchALL } = require('../../lib/postgres')

const getList = (limit, page, user_id) => {
   const QUERY = `
      SELECT
         *
      FROM
         transactions
      ${
         user_id ? (
            `WHERE user_id = ${user_id}`
         ) : ""
      }
      ORDER BY
         id DESC
      LIMIT  ${limit}
      OFFSET ${Number((page - 1) * limit)};
   `;

   return fetchALL(QUERY)
}

module.exports = {
   getList
}