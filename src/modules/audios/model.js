const { fetch, fetchALL } = require('../../lib/postgres')

const audiosByLimit = (limit, page) => {
   const QUERY = `
      SELECT
         *
      FROM
         audios
      ORDER BY
         audio_id DESC
      LIMIT ${limit}
      OFFSET ${Number((page - 1) * limit)};
   `;

   return fetchALL(QUERY)
}
const audioslist = () => {
   const QUERY = `
      SELECT
         *
      FROM
         audios
      ORDER BY
         audio_id DESC
   `;

   return fetchALL(QUERY)
}
const foundBySuraId = (sura_id) => {
   const QUERY = `
      SELECT 
         *
      FROM
         audios
      WHERE
         sura_id = $1;
   `;

   return fetchALL(QUERY, sura_id)
}
const addAudio = (author_id, sura_id, time, audioUrl, audioName) => {
   const QUERY = `
      INSERT INTO
         audios (
            author_id,
            sura_id,
            audio_time,
            audio_link,
            audio_name
         ) VALUES (
            $1,
            $2,
            $3,
            $4,
            $5
         ) RETURNING *;
   `;

   return fetch(QUERY, author_id, sura_id, time, audioUrl, audioName)
}
const foundAudio = (audio_id) => {
   const QUERY = `
      SELECT
         *
      FROM
         audios
      WHERE
         audio_id = $1;
   `;

   return fetch(QUERY, audio_id)
}
const updateAudio = (audio_id, author_id, sura_id, time, audioUrl, audioName) => {
   const QUERY = `
      UPDATE
         audios
      SET
         author_id = $2,
         sura_id = $3,
         audio_time = $4,
         audio_link = $5,
         audio_name = $6
      WHERE
         audio_id = $1
      RETURNING *;
   `

   return fetch(QUERY, audio_id, author_id, sura_id, time, audioUrl, audioName)
}
const deleteAudio = (audio_id) => {
   const QUERY = `
      DELETE FROM
         audios
      WHERE
         audio_id = $1
      RETURNING *;
   `
   
   return fetch(QUERY, audio_id)
}

module.exports = {
   audiosByLimit,
   audioslist,
   foundBySuraId,
   addAudio,
   foundAudio,
   updateAudio,
   deleteAudio
}