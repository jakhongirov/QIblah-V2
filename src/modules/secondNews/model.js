const { fetch, fetchALL } = require('../../lib/postgres')

const newsAdminList = (limit, page) => {
   const QUERY = `
      SELECT
         *
      FROM
         second_news
      ORDER BY
         news_id DESC
      LIMIT ${limit}
      OFFSET ${Number((page - 1) * limit)}
   `;

   return fetchALL(QUERY)
}
const foundUser = (user_id) => {
   const QUERY = `
      SELECT
         *
      FROM
         users
      WHERE
         user_id = $1;
   `;

   return fetch(QUERY, user_id)
}
const newsList = (
   limit,
   page,
   lang,
   user_id,
   user_country_code,
   user_os,
   user_gender
) => {
   const QUERY = `
      SELECT
         news_id,
         news_title,
         news_description,
         news_button_text,
         news_link,
         news_lang,
         news_image_link,
         news_image_name,
         news_like,
         news_views,
         news_create_at
      FROM
         second_news
      WHERE
         news_active = true
         ${lang ? `AND LOWER(news_lang) = LOWER($1)` : ""}
         AND ($2 = ANY(user_id) OR 'all' = ANY(user_id))
         AND LOWER($3) = ANY(country_code)
         AND LOWER($4) = ANY(os)
         AND (LOWER(gender) = LOWER($5) OR gender = 'all')
      ORDER BY
         news_order
      LIMIT $6
      OFFSET $7
   `;

   return fetchALL(
      QUERY,
      lang || null,
      user_id,
      user_country_code,
      user_os,
      user_gender,
      limit,
      (page - 1) * limit
   );
};
const foundNews = (id) => {
   const QUERY = `
      SELECT
         news_id,
         news_title,
         news_description,
         news_button_text,
         news_link,
         news_lang,
         news_image_link,
         news_image_name,
         news_like,
         news_views,
         news_create_at
      FROM
         second_news
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
   user_id,
   country_code,
   os,
   gender,
   news_order,
   payment_type,
   imgUrl,
   imgName
) => {
   const QUERY = `
      INSERT INTO
         second_news (
            news_title,
            news_description,
            news_button_text,
            news_link,
            news_lang,
            user_id,
            country_code,
            os,
            gender,
            news_order,
            payment_type,
            news_image_link,
            news_image_name
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
      news_title,
      news_description,
      news_button_text,
      news_link,
      news_lang,
      user_id,
      country_code,
      os,
      gender,
      news_order,
      payment_type,
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
   user_id,
   country_code,
   os,
   gender,
   news_order,
   payment_type,
   imgUrl,
   imgName
) => {
   const QUERY = `
      UPDATE
         second_news
      SET
         news_title = $2,
         news_description = $3,
         news_button_text = $4,
         news_link = $5,
         news_lang = $6,
         user_id = $7,
         country_code = $8,
         os = $9,
         gender = $10,
         news_order = $11,
         payment_type = $12,
         news_image_link = $13,
         news_image_name = $14
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
      user_id,
      country_code,
      os,
      gender,
      news_order,
      payment_type,
      imgUrl,
      imgName
   )
}
const editNewsStatus = (news_id, status) => {
   const QUERY = `
      UPDATE
         second_news
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
      INSERT INTO users_second_news(user_id, news_id)
      SELECT $1, $2
      WHERE NOT EXISTS (
         SELECT * FROM users_second_news WHERE user_id = $1 AND news_id = $2
      )
      RETURNING *
   `;

   return fetch(QUERY, user_id, news_id)
}
const editNewsLike = (user_id, news_id) => {
   const QUERY = `
      UPDATE second_news
      SET news_like = news_like + 1
      WHERE news_id = $2
      AND EXISTS (
         SELECT * FROM users_second_news WHERE user_id = $1 AND news_id = $2
      );
   `;

   return fetch(QUERY, user_id, news_id)
}
const editNewsView = (news_id) => {
   const QUERY = `
      UPDATE
         second_news
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
         second_news
      WHERE
         news_id = $1
      RETURNING *;
   `;

   return fetch(QUERY, news_id)
}

module.exports = {
   newsAdminList,
   foundUser,
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