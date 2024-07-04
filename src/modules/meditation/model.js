const { fetchALL, fetch } = require('../../lib/postgres')

// categories

const versionCategory = () => {
   const QUERY = `
      SELECT
         *
      FROM
         versions
      ORDER BY
         version_id DESC;
   `;

   return fetch(QUERY)
}

const categoriesListByLang = (lang) => {
   const QUERY = `
      SELECT
         *
      FROM
         meditation_categories
      WHERE
         category_lang = $1
      ORDER BY
         category_id DESC;
   `

   return fetchALL(QUERY, lang)
}
const categoriesList = () => {
   const QUERY = `
      SELECT
         *
      FROM
         meditation_categories
      ORDER BY
         category_id DESC;
   `

   return fetchALL(QUERY)
}
const addCategory = (
   category_name,
   category_lang
) => {
   const QUERY = `
      INSERT INTO
         meditation_categories (
            category_name,
            category_lang
         ) VALUES (
            $1,
            $2
         ) RETURNING *;
   `;

   return fetch(
      QUERY,
      category_name,
      category_lang
   )
}
const foundCategory = (category_id) => {
   const QUERY = `
      SELECT
         *
      FROM
         meditation_categories
      WHERE
         category_id = $1;
   `;

   return fetch(QUERY, category_id)
}
const updateCategory = (
   category_id,
   category_name,
   category_lang
) => {
   const QUERY = `
      UPDATE
         meditation_categories
      SET
         category_name = $2,
         category_lang = $3
      WHERE
         category_id = $1
      RETURNING *;
   `;

   return fetch(
      QUERY,
      category_id,
      category_name,
      category_lang
   )
}
const deleteCategory = (category_id) => {
   const QUERY = `
      DELETE FROM
         meditation_categories
      WHERE
         category_id = $1
      RETURNING *;
   `;

   return fetch(QUERY, category_id)
}

// items
const itemsListAdmin = (limit, page) => {
   const QUERY = `
      SELECT
         *
      FROM
         meditation_item
      ORDER BY
         item_id DESC
      LIMIT ${limit}
      OFFSET ${Number((page - 1) * limit)};
   `;

   return fetchALL(QUERY)
}
const itemsListByCategory = (category_id) => {
   const QUERY = `
      SELECT
         *
      FROM
         meditation_item
      WHERE
         category_id = $1
      ORDER BY
         (string_to_array(item_name, '.'))[1]::integer;
   `;

   return fetchALL(QUERY, category_id)
}
const addItem = (
   item_name,
   item_description,
   category_id,
   suggested_item,
   audioUrl,
   audioName,
   duration
) => {
   const QUERY = `
      INSERT INTO
         meditation_item (
            item_name,
            item_description,
            category_id,
            suggested_item,
            item_audio_url,
            item_audio_name,
            item_time
         ) VALUES (
            $1,
            $2,
            $3,
            $4,
            $5,
            $6,
            $7
         ) RETURNING *;
   `;

   return fetch(
      QUERY,
      item_name,
      item_description,
      category_id,
      suggested_item,
      audioUrl,
      audioName,
      duration
   )
}
const foundItem = (item_id) => {
   const QUERY = `
      SELECT
         *
      FROM
         meditation_item
      WHERE
      item_id = $1
   `;

   return fetch(QUERY, item_id)
}
const updateItem = (
   item_id,
   item_name,
   item_description,
   category_id,
   suggested_item,
   audioUrl,
   audioName,
   duration
) => {
   const QUERY = `
      UPDATE
         meditation_item
      SET
         item_name = $2,
         item_description = $3,
         category_id = $4,
         suggested_item = $5,
         item_audio_url = $6,
         item_audio_name = $7,
         item_time = $8
      WHERE
         item_id = $1
      RETURNING *;
   `;

   return fetch(
      QUERY,
      item_id,
      item_name,
      item_description,
      category_id,
      suggested_item,
      audioUrl,
      audioName,
      duration
   )
}
const deleteItem = (item_id) => {
   const QUERY = `
      DELETE FROM
         meditation_item
      WHERE
         item_id = $1
      RETURNING *;
   `;

   return fetch(QUERY, item_id)
}

module.exports = {
   // categories
   versionCategory,
   categoriesListByLang,
   categoriesList,
   addCategory,
   foundCategory,
   updateCategory,
   deleteCategory,

   // items
   itemsListAdmin,
   itemsListByCategory,
   addItem,
   foundItem,
   updateItem,
   deleteItem
}