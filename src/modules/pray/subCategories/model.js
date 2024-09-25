const { fetchALL, fetch } = require('../../../lib/postgres')

const subCategories = (category_id) => {
   const QUERY = `
      SELECT
         *
      FROM
         sub_categories
      ${category_id ? (
         `
               WHERE
                  category_id = ${category_id}
            `
      ) : ""
      }
      ORDER BY
         sub_categories;
   `;

   return fetchALL(QUERY)
}
const addSubCategoriesFile = (
   id,
   sub_category_name,
   have_item,
   numeric,
   category_id,
   imgUrl,
   imgName
) => {
   const QUERY = `
      INSERT INTO
         sub_categories (
            sub_category_id,
            sub_category_name,
            have_item,
            numeric,
            category_id,
            sub_category_image_link,
            sub_category_image_name
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
      id,
      sub_category_name,
      have_item,
      numeric,
      category_id,
      imgUrl,
      imgName
   )
}
const addSubCategories = (
   sub_category_name,
   have_item,
   numeric,
   category_id,
   imgUrl,
   imgName
) => {
   const QUERY = `
      INSERT INTO
         sub_categories (
            sub_category_name,
            have_item,
            numeric,
            category_id,
            sub_category_image_link,
            sub_category_image_name
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
      sub_category_name,
      have_item,
      numeric,
      category_id,
      imgUrl,
      imgName
   )
}
const foundSubCategory = (sub_category_id) => {
   const QUERY = `
      SELECT
         *
      FROM
         sub_categories
      WHERE
         sub_category_id = $1;
   `;

   return fetch(QUERY, subCategories)
}
const editSubCategory = (
   sub_category_id,
   sub_category_name,
   have_item,
   numeric,
   category_id,
   imgUrl,
   imgName
) => {
   const QUERY = `
      UPDATE
         sub_categories
      SET 
         sub_category_name = $2,
         have_item = $3,
         numeric = $4,
         category_id = $5,
         sub_category_image_link = $6,
         sub_category_image_name = $7
      WHERE
         sub_category_id = $1
      RETURNING *;
   `;

   return fetch(
      QUERY,
      sub_category_id,
      sub_category_name,
      have_item,
      numeric,
      category_id,
      imgUrl,
      imgName
   )
}
const deleteSubCategory = (sub_category_id) => {
   const QUERY = `
      DELETE FROM
         sub_categories
      WHERE
         sub_category_id = $1
      RETURNING *;
   `;

   return fetch(QUERY, sub_category_id)
}

module.exports = {
   subCategories,
   addSubCategoriesFile,
   addSubCategories,
   foundSubCategory,
   editSubCategory,
   deleteSubCategory
}