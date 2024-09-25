const { fetchALL, fetch } = require('../../../lib/postgres')

const categories = (lang_id, gender) => {
   const QUERY = `
      SELECT
         *
      FROM
         pray_categories
      ${lang_id && gender ? (
         `
            WHERE
               lang_id = ${lang_id} and category_gender = ${gender}
         `
      ) : lang_id ? (
         `
            WHERE
               lang_id = ${lang_id} 
         `
      ) : ""}
      ORDER BY
         category_order;
   `;

   return fetchALL(QUERY)
}
const addCategoryFile = (
   id,
   category_name,
   category_description,
   category_text_color,
   category_description_color,
   category_background_color,
   category_big,
   category_gender,
   category_order,
   lang_id,
   imgUrl,
   imgName
) => {
   const QUERY = `
      INSERT INTO 
         pray_categories (
            category_id,
            category_name,
            category_description,
            category_text_color,
            category_description_color,
            category_background_color,
            category_big,
            category_gender,
            category_order,
            lang_id,
            category_image_link,
            category_image_name
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
      id,
      category_name,
      category_description,
      category_text_color,
      category_description_color,
      category_background_color,
      category_big,
      category_gender,
      category_order,
      lang_id,
      imgUrl,
      imgName
   )
}
const addCategory = (
   category_name,
   category_description,
   category_text_color,
   category_description_color,
   category_background_color,
   category_big,
   category_gender,
   category_order,
   lang_id,
   imgUrl,
   imgName
) => {
   const QUERY = `
      INSERT INTO 
         pray_categories (
            category_name,
            category_description,
            category_text_color,
            category_description_color,
            category_background_color,
            category_big,
            category_gender,
            category_order,
            lang_id,
            category_image_link,
            category_image_name
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
            $11
         ) RETURNING *;
   `;

   return fetch(
      QUERY,
      category_name,
      category_description,
      category_text_color,
      category_description_color,
      category_background_color,
      category_big,
      category_gender,
      category_order,
      lang_id,
      imgUrl,
      imgName
   )
}
const foundCategory = (category_id) => {
   const QUERY = `
      SELECT
         *
      FROM
         pray_categories
      WHERE
         category_id = $1;
   `;

   return fetch(QUERY, category_id)
}
const editCategory = (
   category_id,
   category_name,
   category_description,
   category_text_color,
   category_description_color,
   category_background_color,
   category_big,
   category_gender,
   category_order,
   lang_id,
   imgUrl,
   imgName
) => {
   const QUERY = `
      UPDATE
         pray_categories
      SET
         category_name = $2,
         category_description = $3,
         category_text_color = $4,
         category_description_color = $5,
         category_background_color = $6,
         category_big = $7,
         category_gender = $8,
         category_order = $9,
         lang_id = $10,
         category_image_link = $11,
         category_image_name = $12
      WHERE
         category_id = $1
      RETURNING *;
   `;

   return fetch(
      QUERY,
      category_id,
      category_name,
      category_description,
      category_text_color,
      category_description_color,
      category_background_color,
      category_big,
      category_gender,
      category_order,
      lang_id,
      imgUrl,
      imgName
   )
}

module.exports = {
   categories,
   addCategoryFile,
   addCategory,
   foundCategory,
   editCategory
}