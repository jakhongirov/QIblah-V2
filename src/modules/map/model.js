const { fetchALL, fetch } = require('../../lib/postgres')

const getList = () => {
   const QUERY = `
      SELECT
         *
      FROM
         map_key
      ORDER BY
         key_id DESC;
   `;

   return fetchALL(QUERY)
}
const getRandom = (type) => {
   const QUERY = `
      SELECT
         *
      FROM
         map_key
      ${type ? (
         `
               WHERE
                  type = '${type}'
            `
      ) : ""
      };
   `;

   return fetchALL(QUERY)
}
const addKey = (key, type) => {
   const QUERY = `
      INSERT INTO 
         map_key (
            key,
            type
         ) VALUES (
            $1,
            $2
         ) RETURNING *;
   `;

   return fetch(QUERY, key, type)
}
const deleteKey = (id) => {
   const QUERY = `
      DELETE FROM
         map_key
      WHERE
         key_id = $1
      RETURNING *;
   `;

   return fetch(QUERY, id)
}

module.exports = {
   getList,
   getRandom,
   addKey,
   deleteKey
}