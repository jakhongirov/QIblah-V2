const { fetch, fetchALL } = require('../../lib/postgres')

const zikrListByCategory = (limit, page, category_id) => {
   const QUERY = `
      SELECT
         *
      FROM
         zikrs a
      INNER JOIN
         zikr_categories b
      ON
         a.category_id = b.category_id
      WHERE
         a.category_id = $1
      ORDER BY
         zikr_id DESC
      LIMIT ${limit}
      OFFSET ${Number((page - 1) * limit)}
   `;

   return fetchALL(QUERY, category_id)
}
const zikrList = (limit, page) => {
   const QUERY = `
      SELECT
         *
      FROM
         zikrs
      ORDER BY
         zikr_id DESC
      LIMIT ${limit}
      OFFSET ${Number((page - 1) * limit)};
   `;

   return fetchALL(QUERY)
}
const foundZikr = (id) => {
   const QUERY = `
      SELECT
         *
      FROM
         zikrs
      WHERE
         zikr_id = $1;
   `;

   return fetch(QUERY, id)
}
const addZikr = (
   zikr_title,
   zikr_description,
   zikr_daily_count,
   category_id,
   audioUrl,
   audioName,
   zikr_info
) => {
   const QUERY = `
      INSERT INTO
         zikrs (
            zikr_title,
            zikr_description,
            zikr_daily_count,
            category_id,
            zikr_audio_link,
            zikr_audio_name,
            zikr_info
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
      zikr_title,
      zikr_description,
      zikr_daily_count,
      category_id,
      audioUrl,
      audioName,
      zikr_info
   )
}
const editZikr = (
   zikr_id,
   zikr_title,
   zikr_description,
   zikr_daily_count,
   category_id,
   audioUrl,
   audioName,
   zikr_info
) => {
   const QUERY = `
      UPDATE
         zikrs
      SET
         zikr_title = $2,
         zikr_description = $3,
         zikr_daily_count = $4,
         category_id = $5,
         zikr_audio_link = $6,
         zikr_audio_name = $7,
         zikr_info = $8
      WHERE
         zikr_id = $1
      RETURNING *;
   `;

   return fetch(
      QUERY,
      zikr_id,
      zikr_title,
      zikr_description,
      zikr_daily_count,
      category_id,
      audioUrl,
      audioName,
      zikr_info
   )
}
const deleteZikr = (zikr_id) => {
   const QUERY = `
      DELETE FROM
         zikrs
      WHERE
         zikr_id = $1
      RETURNING *;
   `;

   return fetch(QUERY, zikr_id)
}


module.exports = {
   zikrListByCategory,
   zikrList,
   foundZikr,
   addZikr,
   editZikr,
   deleteZikr
}