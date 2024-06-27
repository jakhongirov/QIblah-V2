const { fetchALL, fetch } = require('../../lib/postgres')

const voteList = (limit, page, lang) => {
   const QUERY = `
      SELECT
         *
      FROM
         additional_votes
      ${lang ? `
         WHERE
            vote_lang = '${lang}'
      ` : ""}
      ORDER BY
         vote_id DESC
      LIMIT ${limit}
      OFFSET ${Number((page - 1) * limit)};
   `;

   return fetchALL(QUERY)
}
const versionVote = () => {
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
const addVote = (
   vote_name,
   vote_lang,
   suggested_item,
   audioUrl,
   audioName,
   iconUrl,
   iconName
) => {
   const QUERY = `
      INSERT INTO
         additional_votes (
            vote_name,
            vote_lang,
            suggested_item,
            vote_audio_url,
            vote_audio_name,
            vote_icon_url,
            vote_icon_name
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
      vote_name,
      vote_lang,
      suggested_item,
      audioUrl,
      audioName,
      iconUrl,
      iconName
   )
}
const foundVote = (vote_id) => {
   const QUERY = `
      SELECT
         *
      FROM
         additional_votes
      WHERE
         vote_id = $1;
   `;

   return fetch(QUERY, vote_id)
}
const updateVote = (
   vote_id,
   vote_name,
   vote_lang,
   suggested_item,
   audioUrl,
   audioName,
   iconUrl,
   iconName
) => {
   const QUERY = `
      UPDATE
         additional_votes
      SET
         vote_name = $2,
         vote_lang = $3,
         suggested_item = $4,
         vote_audio_url = $5,
         vote_audio_name = $6,
         vote_icon_url = $7,
         vote_icon_name = $8
      WHERE
         vote_id = $1
      RETURNING *;
   `;

   return fetch(
      QUERY,
      vote_id,
      vote_name,
      vote_lang,
      suggested_item,
      audioUrl,
      audioName,
      iconUrl,
      iconName
   )
}
const deleteVote = (vote_id) => {
   const QUERY = `
      DELETE FROM
         additional_votes
      WHERE
         vote_id = $1
      RETURNING *;
   `;

   return fetch(QUERY, vote_id)
}

module.exports = {
   voteList,
   versionVote,
   addVote,
   foundVote,
   updateVote,
   deleteVote
}