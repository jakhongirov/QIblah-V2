const { fetch, fetchALL } = require('../../lib/postgres')

const authorsList = () => {
   const QUERY = `
      SELECT 
         *
      FROM
         authors
      ORDER BY
         author_id DESC
   `;

   return fetchALL(QUERY)
}
const addAuthor = (author_name, imgUrl, imgName) => {
   const QUERY = `
      INSERT INTO
         authors (
            author_name,
            author_image_url,
            author_image_name
         ) VALUES (
            $1,
            $2,
            $3
         ) RETURNING *;
   `;

   return fetch(QUERY, author_name, imgUrl, imgName)
}
const foundAuthor = (author_id) => {
   const QUERY = `
      SELECT
         *
      FROM
         authors
      WHERE
         author_id = $1;
   `;

   return fetch(QUERY, author_id)
}
const updateAuthor = (author_id, author_name, imgUrl, imgName) => {
   const QUERY = `
      UPDATE
         authors
      SET
         author_name = $2,
         author_image_url = $3,
         author_image_name = $4
      WHERE
         author_id = $1
      RETURNING *;
   `;

   return fetch(QUERY, author_id, author_name, imgUrl, imgName)
}
const deleteAuthor = (author_id) => {
   const QUERY = `
      DELETE FROM
         authors
      WHERE
         author_id = $1
      RETURNING *;
   `;

   return fetch(QUERY, author_id)
}

module.exports = {
   authorsList,
   addAuthor,
   foundAuthor,
   updateAuthor,
   deleteAuthor
}