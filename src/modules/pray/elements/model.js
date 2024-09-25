const { fetchALL, fetch } = require('../../../lib/postgres')

const elements = (sub_category_id) => {
   const QUERY = `
      SELECT
         *
      FROM
         elements
      ${sub_category_id ? (
         `
            WHERE
               sub_category_id = ${sub_category_id}
         `
      ) : ""
      } 
      ORDER BY
         id
   `;

   return fetchALL(QUERY)
}
const foundElement = (id) => {
   const QUERY = `
      SELECT
         *
      FROM
         elements
      WHERE
         id = $1;
   `;

   return fetch(QUERY, id)
}
const zam_suras = () => {
   const QUERY = `
      SELECT
         *
      FROM
         duos
      WHERE
         zam_sura = true;
   `;

   return fetchALL(QUERY)
}
const foundDuo = (id) => {
   const QUERY = `
      SELECT
         *
      FROM
         duos
      WHERE
         id = $1;
   `;

   return fetch(QUERY, id)
}
const addElementFile = (
   id,
   title,
   text_1,
   text_2,
   zam_suras,
   duo_1,
   duo_2,
   duo_3,
   sub_category_id,
   audioUrl,
   audioName,
   imgUrl,
   imgName
) => {
   const QUERY = `
      INSERT INTO
         elements (
            id,
            title,
            text_1,
            text_2,
            zam_suras,
            duo_1,
            duo_2,
            duo_3,
            sub_category_id,
            audio_link,
            audio_name,
            image_link,
            image_name 
         ) VALUES (
            $1,
            $2,
            $3,
            $4,
            $5,
            $6,
            $7,
            $8,
            $9,
            $10,
            $11,
            $12,
            $13
         ) RETURNING *;
   `;

   return fetch(
      QUERY,
      id,
      title,
      text_1,
      text_2,
      zam_suras,
      duo_1,
      duo_2,
      duo_3,
      sub_category_id,
      audioUrl,
      audioName,
      imgUrl,
      imgName
   )
}
const addElement = (
   title,
   text_1,
   text_2,
   zam_suras,
   duo_1,
   duo_2,
   duo_3,
   sub_category_id,
   audioUrl,
   audioName,
   imgUrl,
   imgName
) => {
   const QUERY = `
      INSERT INTO
         elements (
            title,
            text_1,
            text_2,
            zam_suras,
            duo_1,
            duo_2,
            duo_3,
            sub_category_id,
            audio_link,
            audio_name,
            image_link,
            image_name 
         ) VALUES (
            $1,
            $2,
            $3,
            $4,
            $5,
            $6,
            $7,
            $8,
            $9,
            $10,
            $11,
            $12
         ) RETURNING *;
   `;

   return fetch(
      QUERY,
      title,
      text_1,
      text_2,
      zam_suras,
      duo_1,
      duo_2,
      duo_3,
      sub_category_id,
      audioUrl,
      audioName,
      imgUrl,
      imgName
   )
}
const editElement = (
   id,
   title,
   text_1,
   text_2,
   zam_suras,
   duo_1,
   duo_2,
   duo_3,
   sub_category_id,
   audioUrl,
   audioName,
   imgUrl,
   imgName
) => {
   const QUERY = `
      UPDATE
         elements
      SET
         title = $2,
         text_1 = $3,
         text_2 = $4,
         zam_suras = $5,
         duo_1 = $6,
         duo_2 = $7,
         duo_3 = $8,
         sub_category_id = $9,
         audio_link = $10,
         audio_name = $11,
         image_link = $12,
         image_name = $13
      WHERE
         id = $1
      RETURNING *; 
   `;

   return fetch(
      QUERY,
      id,
      title,
      text_1,
      text_2,
      zam_suras,
      duo_1,
      duo_2,
      duo_3,
      sub_category_id,
      audioUrl,
      audioName,
      imgUrl,
      imgName
   )
}
const deleteElement = (id) => {
   const QUERY = `
      DELETE FROM
         elements
      WHERE
         id = $1
      RETURNING *;
   `;

   return fetch(QUERY, id)
}

module.exports = {
   elements,
   foundElement,
   zam_suras,
   foundDuo,
   addElementFile,
   addElement,
   editElement,
   deleteElement,
}