const { fetch, fetchALL } = require('../../lib/postgres')

const newsAdminList = (limit, page) => {
   const QUERY = `
      SELECT
         *
      FROM
         news
      ORDER BY
         news_id DESC
      LIMIT ${limit}
      OFFSET ${Number((page - 1) * limit)}
   `;

   return fetchALL(QUERY)
}
const newsList = (limit, page, lang) => {
   const QUERY = `
      SELECT
         *
      FROM
         news
      WHERE
         news_active = true
         ${lang ? `and news_lang = '${lang}'` : ""}
      ORDER BY
         news_id DESC
      LIMIT ${limit}
      OFFSET ${Number((page - 1) * limit)}
   `;

   return fetchALL(QUERY)
}
const foundNews = (id) => {
   const QUERY = `
      SELECT
         *
      FROM
         news
      WHERE
         news_id = $1;
   `;

   return fetch(QUERY, id)
}
const addNews = (
   news_title,
   news_description,
   news_button_text,
   news_link,
   news_lang,
   imgUrl,
   imgName
) => {
   const QUERY = `
      INSERT INTO
         news (
            news_title,
            news_description,
            news_button_text,
            news_link,
            news_lang,
            news_image_link,
            news_image_name
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
      news_title,
      news_description,
      news_button_text,
      news_link,
      news_lang,
      imgUrl,
      imgName
   )
}
const editNews = (
   news_id,
   news_title,
   news_description,
   news_button_text,
   news_link,
   news_lang,
   imgUrl,
   imgName
) => {
   const QUERY = `
      UPDATE
         news
      SET
         news_title = $2,
         news_description = $3,
         news_button_text = $4,
         news_link = $5,
         news_lang = $6,
         news_image_link = $7,
         news_image_name = $8
      WHERE
         news_id = $1
      RETURNING *;
   `;

   return fetch(
      QUERY,
      news_id,
      news_title,
      news_description,
      news_button_text,
      news_link,
      news_lang,
      imgUrl,
      imgName
   )
}
const editNewsStatus = (news_id, status) => {
   const QUERY = `
      UPDATE
         news
      SET
         news_active = $2
      WHERE
         news_id = $1
      RETURNING *;
   `;

   return fetch(QUERY, news_id, status)
}
const addNewsLike = (user_id, news_id) => {
   const QUERY = `
      INSERT INTO users_news(user_id, news_id)
      SELECT $1, $2
      WHERE NOT EXISTS (
         SELECT * FROM users_news WHERE user_id = $1 AND news_id = $2
      )
      RETURNING *
   `;

   return fetch(QUERY, user_id, news_id)
}
const editNewsLike = (user_id, news_id) => {
   const QUERY = `
      UPDATE news
      SET news_like = news_like + 1
      WHERE news_id = $2
      AND EXISTS (
         SELECT * FROM users_news WHERE user_id = $1 AND news_id = $2
      );
   `;

   return fetch(QUERY, user_id, news_id)
}
const editNewsView = (news_id) => {
   const QUERY = `
      UPDATE
         news
      SET
         news_views = news_views + 1
      WHERE
          news_id = $1
      RETURNING *;
   `;

   return fetch(QUERY, news_id)
}
const deleteNews = (news_id) => {
   const QUERY = `
      DELETE FROM
         news
      WHERE
         news_id = $1
      RETURNING *;
   `;

   return fetch(QUERY, news_id)
}

module.exports = {
   newsAdminList,
   newsList,
   foundNews,
   addNews,
   editNews,
   editNewsStatus,
   addNewsLike,
   editNewsLike,
   editNewsView,
   deleteNews
}