const { fetchALL, fetch } = require('../../../lib/postgres')

const duos = (lang_id) => {
   const QUERY = `
      SELECT
         *
      FROM
         duos a
      ${lang_id ? (
         `
            INNER JOIN
               languages b
            ON
               a.lang_id = b.id
            WHERE
               b.name = '${lang_id}'
            `
      ) : ""
      }
      ORDER BY
         a.id
   `;

   return fetchALL(QUERY)
}
const addDuoFile = (
   id,
   title,
   text,
   translation,
   lang_id,
   zam_sura,
   audioUrl,
   audioName
) => {
   const QUERY = `
      INSERT INTO
         duos (
            id,
            title,
            text,
            translation,
            lang_id,
            zam_sura,
            audio_link,
            audio_name
         ) VALUES (
            $1,
            $2,
            $3,
            $4,
            $5,
            $6,
            $7,
            $8
         ) RETURNING *;
   `;

   return fetch(
      QUERY,
      id,
      title,
      text,
      translation,
      lang_id,
      zam_sura,
      audioUrl,
      audioName
   )
}
const addDuo = (
   title,
   text,
   translation,
   lang_id,
   zam_sura,
   audioUrl,
   audioName
) => {
   const QUERY = `
      INSERT INTO
         duos (
            title,
            text,
            translation,
            lang_id,
            zam_sura,
            audio_link,
            audio_name
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
      title,
      text,
      translation,
      lang_id,
      zam_sura,
      audioUrl,
      audioName
   )
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
const editDuo = (
   id,
   title,
   text,
   translation,
   lang_id,
   zam_sura,
   audioUrl,
   audioName
) => {
   const QUERY = `
      UPDATE
         duos
      SET
         title = $2,
         text = $3,
         translation = $4,
         lang_id = $5,
         zam_sura = $6,
         audio_link = $7,
         audio_name = $8
      WHERE
         id = $1
      RETURNING *;
   `;

   return fetch(
      QUERY,
      id,
      title,
      text,
      translation,
      lang_id,
      zam_sura,
      audioUrl,
      audioName
   )
}
const deleteDuo = (id) => {
   const QUERY = `
      DELETE FROM
         duos
      WHERE
         id = $1
      RETURNING *;
   `;

   return fetch(QUERY, id)
}

module.exports = {
   duos,
   addDuoFile,
   addDuo,
   foundDuo,
   editDuo,
   deleteDuo
}