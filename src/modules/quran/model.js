const { fetch, fetchALL } = require('../../lib/postgres')

const quranList = (lang, limit, page) => {
   if (lang == "uzbek") {
      const QUERY = `
         SELECT
            sura_id,
            sura_name_arabic,
            sura_name_uzbek AS name,
            sura_verse_count,
            sura_from,
            sura_create_at
         FROM
            quran
         ORDER BY
            sura_id
         LIMIT ${limit}
         OFFSET ${Number((page - 1) * limit)}
      `;

      return fetchALL(QUERY)
   } else if (lang == "cyrillic") {
      const QUERY = `
         SELECT
            sura_id,
            sura_name_arabic,
            sura_name_cyrillic AS name,
            sura_verse_count,
            sura_from,
            sura_create_at
         FROM
            quran
         ORDER BY
            sura_id
         LIMIT ${limit}
         OFFSET ${Number((page - 1) * limit)}
      `;

      return fetchALL(QUERY)
   } else if (lang == 'russian') {
      const QUERY = `
         SELECT
            sura_id,
            sura_name_arabic,
            sura_name_russian AS name,
            sura_verse_count,
            sura_from,
            sura_create_at
         FROM
            quran
         ORDER BY
            sura_id
         LIMIT ${limit}
         OFFSET ${Number((page - 1) * limit)}
      `;

      return fetchALL(QUERY)
   } else if (lang == "english") {
      const QUERY = `
         SELECT
            sura_id,
            sura_name_arabic,
            sura_name_english AS name,
            sura_verse_count,
            sura_from,
            sura_create_at
         FROM
            quran
         ORDER BY
            sura_id
         LIMIT ${limit}
         OFFSET ${Number((page - 1) * limit)}
      `;

      return fetchALL(QUERY)
   } else if (lang == "kazakh") {
      const QUERY = `
         SELECT
            sura_id,
            sura_name_arabic,
            sura_name_kazakh AS name,
            sura_verse_count,
            sura_from,
            sura_create_at
         FROM
            quran
         ORDER BY
            sura_id
         LIMIT ${limit}
         OFFSET ${Number((page - 1) * limit)}
      `;

      return fetchALL(QUERY)
   } else {
      const QUERY = `
         SELECT
            *
         FROM
            quran
         ORDER BY
            sura_id
         LIMIT ${limit}
         OFFSET ${Number((page - 1) * limit)}
      `;

      return fetchALL(QUERY)
   }
}
const foundSura = (id, lang) => {
   if (lang == "uzbek") {
      const QUERY = `
         SELECT
            sura_id,
            sura_name_arabic,
            sura_name_uzbek AS name,
            sura_verse_count,
            sura_from,
            sura_create_at
         FROM
            quran
         WHERE
            sura_id = $1;
      `;

      return fetch(QUERY, id)
   } else if (lang == "cyrillic") {
      const QUERY = `
         SELECT
            sura_id,
            sura_name_arabic,
            sura_name_cyrillic AS name,
            sura_verse_count,
            sura_from,
            sura_create_at
         FROM
            quran       
         WHERE
            sura_id = $1;
      `;

      return fetch(QUERY, id)
   } else if (lang == 'russian') {
      const QUERY = `
         SELECT
            sura_id,
            sura_name_arabic,
            sura_name_russian AS name,
            sura_verse_count,
            sura_from,
            sura_create_at
         FROM
            quran
         WHERE
            sura_id = $1;
      `;

      return fetch(QUERY, id)
   } else if (lang == "english") {
      const QUERY = `
         SELECT
            sura_id,
            sura_name_arabic,
            sura_name_english AS name,
            sura_verse_count,
            sura_from,
            sura_create_at
         FROM
            quran
         WHERE
            sura_id = $1;
      `;

      return fetch(QUERY, id)
   } else if (lang == "kazakh") {
      const QUERY = `
         SELECT
            sura_id,
            sura_name_arabic,
            sura_name_kazakh AS name,
            sura_verse_count,
            sura_from,
            sura_create_at
         FROM
            quran
         WHERE
            sura_id = $1;
      `;

      return fetch(QUERY, id)
   } else {
      const QUERY = `
         SELECT
            *
         FROM
            quran
         WHERE
            sura_id = $1;
      `;

      return fetch(QUERY, id)
   }
}
const addSura = (
   sura_name_arabic,
   sura_name_uzbek,
   sura_name_cyrillic,
   sura_name_russian,
   sura_name_english,
   sura_name_kazakh,
   sura_verse_count,
   sura_from
) => {
   const QUERY = `
      INSERT INTO
         quran (
            sura_name_arabic,
            sura_name_uzbek,
            sura_name_cyrillic,
            sura_name_russian,
            sura_name_english,
            sura_name_kazakh,
            sura_verse_count,
            sura_from
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
      sura_name_arabic,
      sura_name_uzbek,
      sura_name_cyrillic,
      sura_name_russian,
      sura_name_english,
      sura_name_kazakh,
      sura_verse_count,
      sura_from
   )
}
const editSura = (
   sura_id,
   sura_name_arabic,
   sura_name_uzbek,
   sura_name_cyrillic,
   sura_name_russian,
   sura_name_english,
   sura_name_kazakh,
   sura_verse_count,
   sura_from
) => {
   const QUERY = `
      UPDATE
         quran
      SET
         sura_name_arabic = $2,
         sura_name_uzbek = $3,
         sura_name_cyrillic = $4,
         sura_name_russian = $5,
         sura_name_english = $6,
         sura_name_kazakh = $7,
         sura_verse_count = $8,
         sura_from = $9
      WHERE
         sura_id = $1
      RETURNING *;
   `;

   return fetch(
      QUERY,
      sura_id,
      sura_name_arabic,
      sura_name_uzbek,
      sura_name_cyrillic,
      sura_name_russian,
      sura_name_english,
      sura_name_kazakh,
      sura_verse_count,
      sura_from
   )
}
const deleteSura = (sura_id) => {
   const QUERY = `
      DELETE FROM
         quran
      WHERE
         sura_id = $1
      RETURNING *;
   `;

   return fetch(QUERY, sura_id)
}

module.exports = {
   quranList,
   foundSura,
   addSura,
   editSura,
   deleteSura
}