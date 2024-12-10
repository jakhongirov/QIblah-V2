const { fetch, fetchALL } = require('../../lib/postgres')

const photos = (limit, page) => {
   const QUERY = `
      SELECT
         *
      FROM
         photos
      ORDER
         id DESC
      LIMIT ${limit}
      OFFSET ${Number((page - 1) * limit)}
   `;

   return fetchALL(QUERY)
}
const addPhoto = (imgUrl, imgName) => {
   const QUERY = `
      INSERT INTO 
         photos (
            image_link,
            image_name
         ) VALUES (
            $1, 
            $2 
         ) RETURNING *;
   `;

   return fetch(QUERY, imgUrl, imgName)
}
const deletePhoto = (id) => {
   const QUERY = `
      DELETE FROM
         photos
      WHERE
         id = $1
      RETURNING *;
   `;

   return fetch(QUERY, id)
}

module.exports = {
   photos,
   addPhoto,
   deletePhoto
}