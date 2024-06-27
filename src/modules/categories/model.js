const { fetch, fetchALL } = require('../../lib/postgres')

const getCategoriesByLang = (lang) => {
   const QUERY = `
   SELECT
      *
   FROM
      zikr_categories
   WHERE
      category_lang = $1
   ORDER BY
      category_id DESC;
`;

   return fetchALL(QUERY, lang)
}
const getCategories = () => {
   const QUERY = `
      SELECT
         *
      FROM
         zikr_categories
      ORDER BY
         category_id DESC;
   `;

   return fetchALL(QUERY)
}
const foundCategory = (id) => {
   const QUERY = `
      SELECT
         *
      FROM
         zikr_categories
      WHERE
         category_id = $1;
   `;

   return fetch(QUERY, id)
}
const addCategory = (
   category_name,
   category_lang,
   category_background_color,
   category_text_color,
   imgUrl,
   imgName
) => {
   const QUERY = `
      INSERT INTO
         zikr_categories (
            category_name,
            category_lang,
            category_background_color,
            category_text_color,
            category_image_link,
            category_image_name
         ) VALUES (
            $1,
            $2,
            $3,
            $4,
            $5,
            $6
         ) RETURNING *;
   `;

   return fetch(
      QUERY,
      category_name,
      category_lang,
      category_background_color,
      category_text_color,
      imgUrl,
      imgName
   )
}
const editCategory = (
   category_id,
   category_name,
   category_lang,
   category_background_color,
   category_text_color,
   imgUrl,
   imgName
) => {
   const QUERY = `
      UPDATE
         zikr_categories
      SET
         category_name = $2,
         category_lang = $3,
         category_background_color = $4,
         category_text_color = $5,
         category_image_link = $6,
         category_image_name = $7
      WHERE
         category_id = $1
      RETURNING *;
   `;

   return fetch(
      QUERY,
      category_id,
      category_name,
      category_lang,
      category_background_color,
      category_text_color,
      imgUrl,
      imgName
   )
}
const deleteCategory = (category_id) => {
   const QUERY = `
      DELETE FROM
         zikr_categories
      WHERE
         category_id = $1
      RETURNING *;
   `;

   return fetch(QUERY, category_id)
}

module.exports = {
   getCategoriesByLang,
   getCategories,
   foundCategory,
   addCategory,
   editCategory,
   deleteCategory
}