const { fetch, fetchALL } = require('../../lib/postgres')

const getAdminUserStats = (limit, page) => {
   const QUERY = `
      SELECT
         *
      FROM
         users_stats
      ORDER BY
         id DESC
      LIMIT ${limit}
      OFFSET ${Number((page - 1) * limit)};
   `;

   return fetchALL(QUERY)
}
const foundUserStat = (user_id) => {
   const QUERY = `
      SELECT
         *
      FROM
         users_stats
      WHERE
         user_id = $1;
   `;

   return fetch(QUERY, user_id)
}
const editUserStats = (
   user_id,
   user_qazo,
   verse_id,
   read_verse,
   name_count,
   zikr_id,
   zikr_count
) => {
   const QUERY = `
      UPDATE
         users_stats
      SET
         user_qazo = $2,
         verse_id = $3,
         read_verse = $4,
         name_count = $5,
         zikr_id = $6,
         zikr_count = $7
      WHERE
         user_id = $1
      RETURNING *;
   `;

   return fetch(
      QUERY,
      user_id,
      user_qazo,
      verse_id,
      read_verse,
      name_count,
      zikr_id,
      zikr_count
   )
}
const addUserStats = (
   user_id,
   user_qazo,
   verse_id,
   read_verse,
   name_count,
   zikr_id,
   zikr_count
) => {
   const QUERY = `
      INSERT INTO
         users_stats (
            user_id,
            user_qazo,
            verse_id,
            read_verse,
            name_count,
            zikr_id,
            zikr_count
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
      user_id,
      user_qazo,
      verse_id,
      read_verse,
      name_count,
      zikr_id,
      zikr_count
   )
}
const updateVerseFavCount = (item) => {
   const QUERY = `
      UPDATE
         verses
      SET
         favourite_count = favourite_count + 1
      WHERE
         verse_id = $1
      RETURNING *;
   `;

   return fetch(QUERY, item)
}
const updateZikrFavCount = (item) => {
   const QUERY = `
      UPDATE
         zikrs
      SET
         favourite_count = favourite_count + 1
      WHERE
         zikr_id = $1
      RETURNING *;
   `;

   return fetch(QUERY, item)
}
const editUserQazo = (user_id, user_qazo) => {
   const QUERY = `
      UPDATE
         users_stats
      SET
         user_qazo = $2
      WHERE
         user_id = $1
      RETURNING *;
   `;

   return fetch(QUERY, user_id, user_qazo)
}
const editVerseId = (user_id, verse_id) => {
   const verseIds = verse_id?.map(e => `${e}`).join(', ');

   const QUERY = `
      UPDATE
         users_stats
      SET
         verse_id  =  ARRAY[${verseIds}]
      WHERE
         user_id = $1
      RETURNING *;
   `;

   return fetch(QUERY, user_id)
}
const editVerseRead = (user_id, read_verse) => {
   const readVerses = read_verse?.map(e => `${e}`).join(', ');

   const QUERY = `
      UPDATE
         users_stats
      SET
         read_verse  = ARRAY[${readVerses}]
      WHERE
         user_id = $1
      RETURNING *;
   `;

   return fetch(QUERY, user_id)
}
const editNameCount = (user_id, name_count) => {
   // const nameCountArray = name_count.map(item => `'${JSON.stringify(item).replace(/'/g, "''")}'`);

   const QUERY = `
      UPDATE
         users_stats
      SET
         name_count  = $2::json[]
      WHERE
         user_id = $1
      RETURNING *;
   `;

   return fetch(QUERY, user_id, name_count)
}
const editZikrId = (user_id, zikr_id) => {
   const zikrIds = zikr_id?.map(e => `${e}`).join(', ');

   const QUERY = `
      UPDATE
         users_stats
      SET
         zikr_id  = ARRAY[${zikrIds}]
      WHERE
         user_id = $1
      RETURNING *;
   `;

   return fetch(QUERY, user_id)
}
const editZikrCount = (user_id, zikr_count) => {
   // const zikrCountArray = zikr_count.map(item => `'${JSON.stringify(item).replace(/'/g, "''")}'`);

   const QUERY = `
      UPDATE
         users_stats
      SET
         zikr_count  = $2::json[]
      WHERE
         user_id = $1
      RETURNING *;
   `;

   return fetch(QUERY, user_id, zikr_count)
}
const deleteUserStats = (user_id) => {
   const QUERY = `
      DELETE FROM
         users_stats
      WHERE
         user_id = $1
      RETURNING *;
   `;

   return fetch(QUERY, user_id)
}

module.exports = {
   getAdminUserStats,
   foundUserStat,
   editUserStats,
   addUserStats,
   updateVerseFavCount,
   updateZikrFavCount,
   editUserQazo,
   editVerseId,
   editVerseRead,
   editNameCount,
   editZikrId,
   editZikrCount,
   deleteUserStats
}