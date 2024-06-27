const { fetch, fetchALL } = require('../../lib/postgres')

const publicZikrs = (lang, limit, page) => {
   if (lang == 'uzbek') {
      const QUERY = `
         SELECT
            zikr_id,
            zikr_title_uzbek AS title,
            zikr_description_uzbek AS description,
            zikr_info_uzbek AS info,
            zikr_current_count,
            zikr_count,
            zikr_participants,
            zikr_finishing,
            supporter_lang,
            zikr_audio_link,
            zikr_audio_name,
            zikr_create_at
         FROM
            public_zikr
         ORDER BY
            zikr_id
         LIMIT ${limit}
         OFFSET ${Number((page - 1) * limit)}
      `;

      return fetchALL(QUERY)
   } else if (lang == 'cyrillic') {
      const QUERY = `
         SELECT
            zikr_id,
            zikr_title_cyrillic AS title,
            zikr_description_cyrillic AS description,
            zikr_info_cyrillic AS info,
            zikr_current_count,
            zikr_count,
            zikr_participants,
            zikr_finishing,
            supporter_lang,
            zikr_audio_link,
            zikr_audio_name,
            zikr_create_at
         FROM
            public_zikr
         ORDER BY
            zikr_id
         LIMIT ${limit}
         OFFSET ${Number((page - 1) * limit)}
      `;

      return fetchALL(QUERY)
   } else if (lang == 'russian') {
      const QUERY = `
         SELECT
            zikr_id,
            zikr_title_russian AS title,
            zikr_description_russian AS description,
            zikr_info_russian AS info,
            zikr_current_count,
            zikr_count,
            zikr_participants,
            zikr_finishing,
            supporter_lang,
            zikr_audio_link,
            zikr_audio_name,
            zikr_create_at
         FROM
            public_zikr
         ORDER BY
            zikr_id
         LIMIT ${limit}
         OFFSET ${Number((page - 1) * limit)}
      `;

      return fetchALL(QUERY)
   } else if (lang == 'english') {
      const QUERY = `
         SELECT
            zikr_id,
            zikr_title_english AS title,
            zikr_description_english AS description,
            zikr_info_english AS info,
            zikr_current_count,
            zikr_count,
            zikr_participants,
            zikr_finishing,
            supporter_lang,
            zikr_audio_link,
            zikr_audio_name,
            zikr_create_at
         FROM
            public_zikr
         ORDER BY
            zikr_id
         LIMIT ${limit}
         OFFSET ${Number((page - 1) * limit)}
      `;

      return fetchALL(QUERY)
   } else if (lang == 'kazakh') {
      const QUERY = `
         SELECT
            zikr_id,
            zikr_title_kazakh AS title,
            zikr_description_kazakh AS description,
            zikr_info_kazakh AS info,
            zikr_current_count,
            zikr_count,
            zikr_participants,
            zikr_finishing,
            supporter_lang,
            zikr_audio_link,
            zikr_audio_name,
            zikr_create_at
         FROM
            public_zikr
         ORDER BY
            zikr_id
         LIMIT ${limit}
         OFFSET ${Number((page - 1) * limit)}
      `;

      return fetchALL(QUERY)
   } else {
      const QUERY = `
         SELECT
            *
         FROM
            public_zikr
         ORDER BY
            zikr_id
         LIMIT ${limit}
         OFFSET ${Number((page - 1) * limit)}
      `;

      return fetchALL(QUERY)
   }
}
const foundZikr = (id, lang) => {
   if (lang == 'uzbek') {
      const QUERY = `
         SELECT
            zikr_id,
            zikr_title_uzbek AS title,
            zikr_description_uzbek AS description,
            zikr_info_uzbek AS info,
            zikr_current_count,
            zikr_count,
            zikr_participants,
            zikr_finishing,
            supporter_lang,
            zikr_audio_link,
            zikr_audio_name,
            zikr_create_at
         FROM
            public_zikr
         WHERE
            zikr_id = $1;
      `;

      return fetch(QUERY, id)
   } else if (lang == 'cyrillic') {
      const QUERY = `
         SELECT
            zikr_id,
            zikr_title_cyrillic AS title,
            zikr_description_cyrillic AS description,
            zikr_info_cyrillic AS info,
            zikr_current_count,
            zikr_count,
            zikr_participants,
            zikr_finishing,
            supporter_lang,
            zikr_audio_link,
            zikr_audio_name,
            zikr_create_at
         FROM
            public_zikr
         WHERE
            zikr_id = $1;
      `;

      return fetch(QUERY, id)
   } else if (lang == 'russian') {
      const QUERY = `
         SELECT
            zikr_id,
            zikr_title_russian AS title,
            zikr_description_russian AS description,
            zikr_info_russian AS info,
            zikr_current_count,
            zikr_count,
            zikr_participants,
            zikr_finishing,
            supporter_lang,
            zikr_audio_link,
            zikr_audio_name,
            zikr_create_at
         FROM
            public_zikr
         WHERE
            zikr_id = $1;
      `;

      return fetch(QUERY, id)
   } else if (lang == 'english') {
      const QUERY = `
         SELECT
            zikr_id,
            zikr_title_english AS title,
            zikr_description_english AS description,
            zikr_info_english AS info,
            zikr_current_count,
            zikr_count,
            zikr_participants,
            zikr_finishing,
            supporter_lang,
            zikr_audio_link,
            zikr_audio_name,
            zikr_create_at
         FROM
            public_zikr
         WHERE
            zikr_id = $1;
      `;

      return fetch(QUERY, id)
   } else if (lang == 'kazakh') {
      const QUERY = `
         SELECT
            zikr_id,
            zikr_title_kazakh AS title,
            zikr_description_kazakh AS description,
            zikr_info_kazakh AS info,
            zikr_current_count,
            zikr_count,
            zikr_participants,
            zikr_finishing,
            supporter_lang,
            zikr_audio_link,
            zikr_audio_name,
            zikr_create_at
         FROM
            public_zikr
         WHERE
            zikr_id = $1;
      `;

      return fetch(QUERY, id)
   } else {
      const QUERY = `
      SELECT
         *
      FROM
         public_zikr
      WHERE
         zikr_id = $1;
   `;

      return fetch(QUERY, id)
   }
}
const addPublicZikr = (
   zikr_title_uzbek,
   zikr_description_uzbek,
   zikr_title_cyrillic,
   zikr_description_cyrillic,
   zikr_title_russian,
   zikr_description_russian,
   zikr_title_english,
   zikr_description_english,
   zikr_title_kazakh,
   zikr_description_kazakh,
   zikr_count,
   supporter_lang,
   audioUrl,
   audioName,
   zikr_info_uzbek,
   zikr_info_cyrillic,
   zikr_info_russian,
   zikr_info_english,
   zikr_info_kazakh,
) => {
   const QUERY = `
      INSERT INTO
         public_zikr (
            zikr_title_uzbek,
            zikr_description_uzbek,
            zikr_title_cyrillic,
            zikr_description_cyrillic,
            zikr_title_russian,
            zikr_description_russian,
            zikr_title_english,
            zikr_description_english,
            zikr_title_kazakh,
            zikr_description_kazakh,
            zikr_count,
            supporter_lang,
            zikr_audio_link,
            zikr_audio_name,
            zikr_info_uzbek,
            zikr_info_cyrillic,
            zikr_info_russian,
            zikr_info_english,
            zikr_info_kazakh
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
            $13,
            $14,
            $15,
            $16,
            $17,
            $18,
            $19
         ) RETURNING *;
   `;

   return fetch(
      QUERY,
      zikr_title_uzbek,
      zikr_description_uzbek,
      zikr_title_cyrillic,
      zikr_description_cyrillic,
      zikr_title_russian,
      zikr_description_russian,
      zikr_title_english,
      zikr_description_english,
      zikr_title_kazakh,
      zikr_description_kazakh,
      zikr_count,
      supporter_lang,
      audioUrl,
      audioName,
      zikr_info_uzbek,
      zikr_info_cyrillic,
      zikr_info_russian,
      zikr_info_english,
      zikr_info_kazakh,
   )
}
const editPublicZikr = (
   zikr_id,
   zikr_title_uzbek,
   zikr_description_uzbek,
   zikr_title_cyrillic,
   zikr_description_cyrillic,
   zikr_title_russian,
   zikr_description_russian,
   zikr_title_english,
   zikr_description_english,
   zikr_title_kazakh,
   zikr_description_kazakh,
   zikr_count,
   supporter_lang,
   audioUrl,
   audioName,
   zikr_info_uzbek,
   zikr_info_cyrillic,
   zikr_info_russian,
   zikr_info_english,
   zikr_info_kazakh,
) => {
   const QUERY = `
      UPDATE
         public_zikr
      SET
         zikr_title_uzbek = $2,
         zikr_description_uzbek = $3,
         zikr_title_cyrillic = $4,
         zikr_description_cyrillic = $5,
         zikr_title_russian = $6,
         zikr_description_russian = $7,
         zikr_title_english = $8,
         zikr_description_english = $9,
         zikr_title_kazakh = $10,
         zikr_description_kazakh = $11,
         zikr_count = $12,
         supporter_lang = $13,
         zikr_audio_link = $14,
         zikr_audio_name = $15,
         zikr_info_uzbek = $16,
         zikr_info_cyrillic = $17,
         zikr_info_russian = $18,
         zikr_info_english = $19,
         zikr_info_kazakh = $20
      WHERE
         zikr_id = $1
      RETURNING *;
   `

   return fetch(
      QUERY,
      zikr_id,
      zikr_title_uzbek,
      zikr_description_uzbek,
      zikr_title_cyrillic,
      zikr_description_cyrillic,
      zikr_title_russian,
      zikr_description_russian,
      zikr_title_english,
      zikr_description_english,
      zikr_title_kazakh,
      zikr_description_kazakh,
      zikr_count,
      supporter_lang,
      audioUrl,
      audioName,
      zikr_info_uzbek,
      zikr_info_cyrillic,
      zikr_info_russian,
      zikr_info_english,
      zikr_info_kazakh,
   )
}
const addParticipants = (zikr_id, user_id) => {
   const QUERY = `
      INSERT INTO users_zikr(zikr_id, user_id)
      SELECT $1, $2
      WHERE NOT EXISTS (
         SELECT * FROM users_zikr WHERE zikr_id = $1 AND user_id = $2
      )
      RETURNING *;
   `;

   return fetch(QUERY, zikr_id, user_id)
}
const updateZikrParticipants = (zikr_id) => {
   const QUERY = `
      UPDATE public_zikr
      SET zikr_participants = zikr_participants + 1
      WHERE zikr_id = $1 RETURNING *;;
   `;

   return fetch(QUERY, zikr_id)
}
const editFinishing = (zikr_id, finishing) => {
   const QUERY = `
      UPDATE
         public_zikr
      SET
         zikr_finishing = $2
      WHERE
         zikr_id = $1
      RETURNING *;
   `;

   return fetch(QUERY, zikr_id, finishing)
}
const deletePublicZikr = (zikr_id) => {
   const QUERY = `
      DELETE FROM
         public_zikr
      WHERE
         zikr_id = $1
      RETURNING *;
   `;

   return fetch(QUERY, zikr_id)
}

module.exports = {
   publicZikrs,
   foundZikr,
   addPublicZikr,
   editPublicZikr,
   addParticipants,
   updateZikrParticipants,
   editFinishing,
   deletePublicZikr
}