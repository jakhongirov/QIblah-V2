const { fetch, fetchALL } = require('../../lib/postgres')

const versesList = (limit, page) => {
   const QUERY = `
      SELECT
         *
      FROM
         verses
      ORDER BY
         verse_id DESC
      LIMIT ${limit}
      OFFSET ${Number((page - 1) * limit)}
   `;

   return fetchALL(QUERY)
}
const versesBySura = (suraId, lang) => {
   if (lang == 'uzbek') {
      const QUERY = `
         SELECT
            verse_id,
            sura_number,
            verse_number,
            juz_number,
            juz_divider_text,
            a.sura_id,
            verse_arabic,
            verse_uzbek AS text,
            verse_meaning_uzbek AS meaning,
            verse_create_at
         FROM
            verses a
         INNER JOIN
            quran b
         ON
            a.sura_id = b.sura_id
         WHERE
            a.sura_id = $1
         ORDER BY
            verse_id;
      `;

      return fetchALL(QUERY, suraId)
   } else if (lang == 'cyrillic') {
      const QUERY = `
         SELECT
            verse_id,
            sura_number,
            verse_number,
            juz_number,
            juz_divider_text,
            a.sura_id,
            verse_arabic,
            verse_cyrillic AS text,
            verse_meaning_cyrillic AS meaning,
            verse_create_at
         FROM
            verses a
         INNER JOIN
            quran b
         ON
            a.sura_id = b.sura_id
         WHERE
            a.sura_id = $1
         ORDER BY
            verse_id;
      `;

      return fetchALL(QUERY, suraId)
   } else if (lang == 'russian') {
      const QUERY = `
         SELECT
            verse_id,
            sura_number,
            verse_number,
            juz_number,
            juz_divider_text,
            a.sura_id,
            verse_arabic,
            verse_russian AS text,
            verse_meaning_russian AS meaning,
            verse_create_at
         FROM
            verses a
         INNER JOIN
            quran b
         ON
            a.sura_id = b.sura_id
         WHERE
            a.sura_id = $1
         ORDER BY
            verse_id;
      `;

      return fetchALL(QUERY, suraId)
   } else if (lang == 'english') {
      const QUERY = `
         SELECT
            verse_id,
            sura_number,
            verse_number,
            juz_number,
            juz_divider_text,
            a.sura_id,
            verse_arabic,
            verse_english AS text,
            verse_meaning_english AS meaning,
            verse_create_at
         FROM
            verses a
         INNER JOIN
            quran b
         ON
            a.sura_id = b.sura_id
         WHERE
            a.sura_id = $1
         ORDER BY
            verse_id;
      `;

      return fetchALL(QUERY, suraId)
   } else if (lang == 'kazakh') {
      const QUERY = `
         SELECT
            verse_id,
            sura_number,
            verse_number,
            juz_number,
            juz_divider_text,
            a.sura_id,
            verse_arabic,
            verse_kazakh AS text,
            verse_meaning_kazakh AS meaning,
            verse_create_at
         FROM
            verses a
         INNER JOIN
            quran b
         ON
            a.sura_id = b.sura_id
         WHERE
            a.sura_id = $1
         ORDER BY
            verse_id;
      `;

      return fetchALL(QUERY, suraId)
   } else {
      const QUERY = `
         SELECT
            *
         FROM
            verses a
         INNER JOIN
            quran b
         ON
            a.sura_id = b.sura_id
         WHERE
            a.sura_id = $1
         ORDER BY
            verse_id;
      `;

      return fetchALL(QUERY, suraId)
   }
}
const foundVerse = (id, lang) => {
   if (lang == 'uzbek') {
      const QUERY = `
         SELECT
            verse_id,
            sura_number,
            verse_number,
            juz_number,
            juz_divider_text,
            a.sura_id,
            verse_arabic,
            verse_uzbek AS text,
            verse_meaning_uzbek AS meaning,
            verse_create_at
         FROM
            verses a
         INNER JOIN
            quran b
         ON
            a.sura_id = b.sura_id
         WHERE
            verse_id = $1
         ORDER BY
            verse_id;
      `;

      return fetch(QUERY, id)
   } else if (lang == 'cyrillic') {
      const QUERY = `
         SELECT
            verse_id,
            sura_number,
            verse_number,
            juz_number,
            juz_divider_text,
            a.sura_id,
            verse_arabic,
            verse_cyrillic AS text,
            verse_meaning_cyrillic AS meaning,
            verse_create_at
         FROM
            verses a
         INNER JOIN
            quran b
         ON
            a.sura_id = b.sura_id
         WHERE
            verse_id = $1
         ORDER BY
            verse_id;
      `;

      return fetch(QUERY, id)
   } else if (lang == 'russian') {
      const QUERY = `
         SELECT
            verse_id,
            sura_number,
            verse_number,
            juz_number,
            juz_divider_text,
            a.sura_id,
            verse_arabic,
            verse_russian AS text,
            verse_meaning_russian AS meaning,
            verse_create_at
         FROM
            verses a
         INNER JOIN
            quran b
         ON
            a.sura_id = b.sura_id
         WHERE
            verse_id = $1
         ORDER BY
            verse_id;
      `;

      return fetch(QUERY, id)
   } else if (lang == 'english') {
      const QUERY = `
         SELECT
            verse_id,
            sura_number,
            verse_number,
            juz_number,
            juz_divider_text,
            a.sura_id,
            verse_arabic,
            verse_english AS text,
            verse_meaning_english AS meaning,
            verse_create_at
         FROM
            verses a
         INNER JOIN
            quran b
         ON
            a.sura_id = b.sura_id
         WHERE
            verse_id = $1
         ORDER BY
            verse_id;
      `;

      return fetch(QUERY, id)
   } else if (lang == 'kazakh') {
      const QUERY = `
         SELECT
            verse_id,
            sura_number,
            verse_number,
            juz_number,
            juz_divider_text,
            a.sura_id,
            verse_arabic,
            verse_kazakh AS text,
            verse_meaning_kazakh AS meaning,
            verse_create_at
         FROM
            verses a
         INNER JOIN
            quran b
         ON
            a.sura_id = b.sura_id
         WHERE
            verse_id = $1
         ORDER BY
            verse_id;
      `;

      return fetch(QUERY, id)
   } else {
      const QUERY = `
         SELECT
            *
         FROM
            verses a
         INNER JOIN
            quran b
         ON
            a.sura_id = b.sura_id
         WHERE
            verse_id = $1
         ORDER BY
            verse_id;
      `;

      return fetch(QUERY, id)
   }
}
const getVersesByJuz = (number, lang) => {
   if (lang == 'uzbek') {
      const QUERY = `
         SELECT
            verse_id,
            sura_number,
            verse_number,
            juz_number,
            juz_divider_text,
            a.sura_id,
            verse_arabic,
            verse_uzbek AS text,
            verse_meaning_uzbek AS meaning,
            verse_create_at
         FROM
            verses a
         INNER JOIN
            quran b
         ON
            a.sura_id = b.sura_id
         WHERE
            juz_number = $1
         ORDER BY
            verse_id;
      `;

      return fetchALL(QUERY, number)
   } else if (lang == 'cyrillic') {
      const QUERY = `
         SELECT
            verse_id,
            sura_number,
            verse_number,
            juz_number,
            juz_divider_text,
            a.sura_id,
            verse_arabic,
            verse_cyrillic AS text,
            verse_meaning_cyrillic AS meaning,
            verse_create_at
         FROM
            verses a
         INNER JOIN
            quran b
         ON
            a.sura_id = b.sura_id
         WHERE
            juz_number = $1
         ORDER BY
            verse_id;
      `;

      return fetchALL(QUERY, number)
   } else if (lang == 'russian') {
      const QUERY = `
         SELECT
            verse_id,
            sura_number,
            verse_number,
            juz_number,
            juz_divider_text,
            a.sura_id,
            verse_arabic,
            verse_russian AS text,
            verse_meaning_russian AS meaning,
            verse_create_at
         FROM
            verses a
         INNER JOIN
            quran b
         ON
            a.sura_id = b.sura_id
         WHERE
            juz_number = $1
         ORDER BY
            verse_id;
      `;

      return fetchALL(QUERY, number)
   } else if (lang == 'english') {
      const QUERY = `
         SELECT
            verse_id,
            sura_number,
            verse_number,
            juz_number,
            juz_divider_text,
            a.sura_id,
            verse_arabic,
            verse_english AS text,
            verse_meaning_english AS meaning,
            verse_create_at
         FROM
            verses a
         INNER JOIN
            quran b
         ON
            a.sura_id = b.sura_id
         WHERE
            juz_number = $1
         ORDER BY
            verse_id;
      `;

      return fetchALL(QUERY, number)
   } else if (lang == 'kazakh') {
      const QUERY = `
         SELECT
            verse_id,
            sura_number,
            verse_number,
            juz_number,
            juz_divider_text,
            a.sura_id,
            verse_arabic,
            verse_kazakh AS text,
            verse_meaning_kazakh AS meaning,
            verse_create_at
         FROM
            verses a
         INNER JOIN
            quran b
         ON
            a.sura_id = b.sura_id
         WHERE
            juz_number = $1
         ORDER BY
            verse_id;
      `;

      return fetchALL(QUERY, number)
   } else {
      const QUERY = `
         SELECT
            *
         FROM
            verses a
         INNER JOIN
            quran b
         ON
            a.sura_id = b.sura_id
         WHERE
            juz_number = $1
         ORDER BY
            verse_id;
      `;

      return fetchALL(QUERY, number)
   }
}
const addVerse = (
   verse_arabic,
   verse_uzbek,
   verse_meaning_uzbek,
   verse_cyrillic,
   verse_meaning_cyrillic,
   verse_russian,
   verse_meaning_russian,
   verse_english,
   verse_meaning_english,
   verse_kazakh,
   verse_meaning_kazakh,
   sura_id,
   verse_number,
   juz_number,
   juz_divider_text,
   sura_number,
) => {
   const QUERY = `
      INSERT INTO
         verses (
            verse_arabic,
            verse_uzbek,
            verse_meaning_uzbek,
            verse_cyrillic,
            verse_meaning_cyrillic,
            verse_russian,
            verse_meaning_russian,
            verse_english,
            verse_meaning_english,
            verse_kazakh,
            verse_meaning_kazakh,
            sura_id,
            verse_number,
            juz_number,
            juz_divider_text,
            sura_number
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
            $16
         ) RETURNING *;
   `;

   return fetch(
      QUERY,
      verse_arabic,
      verse_uzbek,
      verse_meaning_uzbek,
      verse_cyrillic,
      verse_meaning_cyrillic,
      verse_russian,
      verse_meaning_russian,
      verse_english,
      verse_meaning_english,
      verse_kazakh,
      verse_meaning_kazakh,
      sura_id,
      verse_number,
      juz_number,
      juz_divider_text,
      sura_number
   )
}
const editVerse = (
   verse_id,
   verse_arabic,
   verse_uzbek,
   verse_meaning_uzbek,
   verse_cyrillic,
   verse_meaning_cyrillic,
   verse_russian,
   verse_meaning_russian,
   verse_english,
   verse_meaning_english,
   verse_kazakh,
   verse_meaning_kazakh,
   sura_id,
   verse_number,
   juz_number,
   juz_divider_text,
   sura_number
) => {
   const QUERY = `
      UPDATE
         verses
      SET
         verse_arabic = $2,
         verse_uzbek = $3,
         verse_meaning_uzbek = $4,
         verse_cyrillic = $5,
         verse_meaning_cyrillic = $6,
         verse_russian = $7,
         verse_meaning_russian = $8,
         verse_english = $9,
         verse_meaning_english = $10,
         verse_kazakh = $11,
         verse_meaning_kazakh = $12,
         sura_id = $13,
         verse_number = $14,
         juz_number = $15,
         juz_divider_text = $16,
         sura_number = $17
      WHERE
         verse_id = $1
      RETURNING *;
   `;

   return fetch(
      QUERY,
      verse_id,
      verse_arabic,
      verse_uzbek,
      verse_meaning_uzbek,
      verse_cyrillic,
      verse_meaning_cyrillic,
      verse_russian,
      verse_meaning_russian,
      verse_english,
      verse_meaning_english,
      verse_kazakh,
      verse_meaning_kazakh,
      sura_id,
      verse_number,
      juz_number,
      juz_divider_text,
      sura_number
   )
}
const deleteVerse = (verse_id) => {
   const QUERY = `
      DELETE FROM
         verses
      WHERE 
         verse_id = $1
      RETURNING *;
   `;

   return fetch(QUERY, verse_id)
}

module.exports = {
   versesList,
   versesBySura,
   foundVerse,
   getVersesByJuz,
   addVerse,
   editVerse,
   deleteVerse
}