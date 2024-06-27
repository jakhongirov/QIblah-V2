const { fetch, fetchALL } = require('../../lib/postgres')

const nameList = (lang) => {
   if (lang == 'uzbek') {
      const QUERY = `
         SELECT
            name_id,
            name_arabic,
            name_title_uzbek AS title,
            name_description_uzbek AS description,
            name_translation_uzbek AS translation,
            name_audio_link,
            name_audio_name,
            name_create_at
         FROM
            names_99
         ORDER BY
            name_id
      `;

      return fetchALL(QUERY)
   } else if (lang == 'cyrillic') {
      const QUERY = `
         SELECT
            name_id,
            name_arabic,
            name_title_cyrillic AS title,
            name_description_cyrillic AS description,
            name_translation_cyrillic AS translation,
            name_audio_link,
            name_audio_name,
            name_create_at
         FROM
            names_99
         ORDER BY
            name_id
      `;

      return fetchALL(QUERY)
   } else if (lang == 'russian') {
      const QUERY = `
         SELECT
            name_id,
            name_arabic,
            name_title_russian AS title,
            name_description_russian AS description,
            name_translation_russian AS translation,
            name_audio_link,
            name_audio_name,
            name_create_at
         FROM
            names_99
         ORDER BY
            name_id
      `;

      return fetchALL(QUERY)
   } else if (lang == 'english') {
      const QUERY = `
         SELECT
            name_id,
            name_arabic,
            name_title_english AS title,
            name_description_english AS description,
            name_translation_english AS translation,
            name_audio_link,
            name_audio_name,
            name_create_at
         FROM
            names_99
         ORDER BY
            name_id
      `;

      return fetchALL(QUERY)
   } else if (lang == 'kazakh') {
      const QUERY = `
         SELECT
            name_id,
            name_arabic,
            name_title_kazakh AS title,
            name_description_kazakh AS description,
            name_translation_kazakh AS translation,
            name_audio_link,
            name_audio_name,
            name_create_at
         FROM
            names_99
         ORDER BY
            name_id
      `;

      return fetchALL(QUERY)
   } else {
      const QUERY = `
         SELECT
            *
         FROM
            names_99
         ORDER BY
            name_id
      `;

      return fetchALL(QUERY)
   }
}
const foundName = (id, lang) => {
   if (lang == 'uzbek') {
      const QUERY = `
         SELECT
            name_id,
            name_arabic,
            name_title_uzbek AS title,
            name_description_uzbek AS description,
            name_translation_uzbek AS translation,
            name_audio_link,
            name_audio_name,
            name_create_at
         FROM
            names_99
         WHERE
            name_id = $1
         ORDER BY
            name_id
      `;

      return fetch(QUERY, id)
   } else if (lang == 'cyrillic') {
      const QUERY = `
         SELECT
            name_id,
            name_arabic,
            name_title_cyrillic AS title,
            name_description_cyrillic AS description,
            name_translation_cyrillic AS translation,
            name_audio_link,
            name_audio_name,
            name_create_at
         FROM
            names_99
         WHERE
            name_id = $1
         ORDER BY
            name_id
      `;

      return fetch(QUERY, id)
   } else if (lang == 'russian') {
      const QUERY = `
         SELECT
            name_id,
            name_arabic,
            name_title_russian AS title,
            name_description_russian AS description,
            name_translation_russian AS translation,
            name_audio_link,
            name_audio_name,
            name_create_at
         FROM
            names_99
         WHERE
            name_id = $1
         ORDER BY
            name_id
      `;

      return fetch(QUERY, id)
   } else if (lang == 'english') {
      const QUERY = `
         SELECT
            name_id,
            name_arabic,
            name_title_english AS title,
            name_description_english AS description,
            name_translation_english AS translation,
            name_audio_link,
            name_audio_name,
            name_create_at
         FROM
            names_99
         WHERE
            name_id = $1
         ORDER BY
            name_id
      `;

      return fetch(QUERY, id)
   } else if (lang == 'kazakh') {
      const QUERY = `
         SELECT
            name_id,
            name_arabic,
            name_title_kazakh AS title,
            name_description_kazakh AS description,
            name_translation_kazakh AS translation,
            name_audio_link,
            name_audio_name,
            name_create_at
         FROM
            names_99
         WHERE
            name_id = $1
         ORDER BY
            name_id
      `;

      return fetch(QUERY, id)
   } else {
      const QUERY = `
         SELECT
            *
         FROM
            names_99
         WHERE
            name_id = $1
         ORDER BY
            name_id
      `;

      return fetch(QUERY, id)
   }
}
const addName = (
   name_arabic,
   name_title_uzbek,
   name_description_uzbek,
   name_translation_uzbek,
   name_title_cyrillic,
   name_description_cyrillic,
   name_translation_cyrillic,
   name_title_russian,
   name_description_russian,
   name_translation_russian,
   name_title_english,
   name_description_english,
   name_translation_english,
   name_title_kazakh,
   name_description_kazakh,
   name_translation_kazakh,
   audioUrl,
   audioName
) => {
   const QUERY = `
      INSERT INTO
         names_99 (
            name_arabic,
            name_title_uzbek,
            name_description_uzbek,
            name_translation_uzbek,
            name_title_cyrillic,
            name_description_cyrillic,
            name_translation_cyrillic,
            name_title_russian,
            name_description_russian,
            name_translation_russian,
            name_title_english,
            name_description_english,
            name_translation_english,
            name_title_kazakh,
            name_description_kazakh,
            name_translation_kazakh,
            name_audio_link,
            name_audio_name
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
            $18
         ) RETURNING *;
   `;

   return fetch(
      QUERY,
      name_arabic,
      name_title_uzbek,
      name_description_uzbek,
      name_translation_uzbek,
      name_title_cyrillic,
      name_description_cyrillic,
      name_translation_cyrillic,
      name_title_russian,
      name_description_russian,
      name_translation_russian,
      name_title_english,
      name_description_english,
      name_translation_english,
      name_title_kazakh,
      name_description_kazakh,
      name_translation_kazakh,
      audioUrl,
      audioName
   )
}
const editName = (
   name_id,
   name_arabic,
   name_title_uzbek,
   name_description_uzbek,
   name_translation_uzbek,
   name_title_cyrillic,
   name_description_cyrillic,
   name_translation_cyrillic,
   name_title_russian,
   name_description_russian,
   name_translation_russian,
   name_title_english,
   name_description_english,
   name_translation_english,
   name_title_kazakh,
   name_description_kazakh,
   name_translation_kazakh,
   audioUrl,
   audioName
) => {
   const QUERY = `
      UPDATE
         names_99
      SET
         name_arabic = $2,
         name_title_uzbek = $3,
         name_description_uzbek = $4,
         name_translation_uzbek = $5,
         name_title_cyrillic = $6,
         name_description_cyrillic = $7,
         name_translation_cyrillic = $8,
         name_title_russian = $9,
         name_description_russian = $10,
         name_translation_russian = $11,
         name_title_english = $12,
         name_description_english = $13,
         name_translation_english = $14,
         name_title_kazakh = $15,
         name_description_kazakh = $16,
         name_translation_kazakh = $17,
         name_audio_link = $18,
         name_audio_name = $19
      WHERE
         name_id = $1
      RETURNING *;
   `;

   return fetch(
      QUERY,
      name_id,
      name_arabic,
      name_title_uzbek,
      name_description_uzbek,
      name_translation_uzbek,
      name_title_cyrillic,
      name_description_cyrillic,
      name_translation_cyrillic,
      name_title_russian,
      name_description_russian,
      name_translation_russian,
      name_title_english,
      name_description_english,
      name_translation_english,
      name_title_kazakh,
      name_description_kazakh,
      name_translation_kazakh,
      audioUrl,
      audioName
   )
}
const deleteName = (name_id) => {
   const QUERY = `
      DELETE FROM
         names_99
      WHERE
         name_id = $1
      RETURNING *;
   `

   return fetch(QUERY, name_id)
}

module.exports = {
   nameList,
   foundName,
   addName,
   editName,
   deleteName
}