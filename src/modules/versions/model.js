const { fetch, fetchALL } = require('../../lib/postgres')

const quranUpdatesByLimit = (limit, page) => {
   const QUERY = `
      SELECT
         *
      FROM
         quran_updates
      ORDER BY
         version_id DESC
      LIMIT ${limit}
      OFFSET ${Number((page - 1) * limit)};
   `;

   return fetchALL(QUERY)
}
const quranUpdates = () => {
   const QUERY = `
      SELECT
         *
      FROM
         quran_updates
      ORDER BY
         version_id DESC;
   `;

   return fetchALL(QUERY)
}
const getUpdates = (version) => {
   const QUERY = `
      SELECT
         *
      FROM
         quran_updates
      WHERE
         quran_version > $1;
   `;

   return fetchALL(QUERY, version)
}
const getUpdatedVerse = (mergedVerses, lang) => {
   const verseIds = mergedVerses?.map(e => `${e}`).join(', ');

   if (lang == 'uzbek') {
      const QUERY = `
         SELECT
            verse_id,
            sura_number,
            verse_number,
            juz_number,
            juz_divider_text,
            sura_id,
            verse_arabic,
            verse_uzbek AS text,
            verse_meaning_uzbek AS meaning,
            verse_create_at
         FROM
            verses
         WHERE
            ARRAY[verse_id::int] && ARRAY[${verseIds}]
         ORDER BY
            verse_id;
      `;

      return fetchALL(QUERY)
   } else if (lang == 'cyrillic') {
      const QUERY = `
         SELECT
            verse_id,
            sura_number,
            verse_number,
            juz_number,
            juz_divider_text,
            sura_id,
            verse_arabic,
            verse_cyrillic AS text,
            verse_meaning_cyrillic AS meaning,
            verse_create_at
         FROM
            verses
         WHERE
            ARRAY[verse_id::int] && ARRAY[${verseIds}]
         ORDER BY
            verse_id;
      `;

      return fetchALL(QUERY)
   } else if (lang == 'russian') {
      const QUERY = `
         SELECT
            verse_id,
            sura_number,
            verse_number,
            juz_number,
            juz_divider_text,
            sura_id,
            verse_arabic,
            verse_russian AS text,
            verse_meaning_russian AS meaning,
            verse_create_at
         FROM
            verses
         WHERE
            ARRAY[verse_id::int] && ARRAY[${verseIds}]
         ORDER BY
            verse_id;
      `;

      return fetchALL(QUERY)
   } else if (lang == 'english') {
      const QUERY = `
         SELECT
            verse_id,
            sura_number,
            verse_number,
            juz_number,
            juz_divider_text,
            sura_id,
            verse_arabic,
            verse_english AS text,
            verse_meaning_english AS meaning,
            verse_create_at
         FROM
            verses
         WHERE
            ARRAY[verse_id::int] && ARRAY[${verseIds}]
         ORDER BY
            verse_id;
      `;

      return fetchALL(QUERY)
   } else if (lang == 'kazakh') {
      const QUERY = `
         SELECT
            verse_id,
            sura_number,
            verse_number,
            juz_number,
            juz_divider_text,
            sura_id,
            verse_arabic,
            verse_kazakh AS text,
            verse_meaning_kazakh AS meaning,
            verse_create_at
         FROM
            verses 
         WHERE
            ARRAY[verse_id::int] && ARRAY[${verseIds}]
         ORDER BY
            verse_id;
      `;

      return fetchALL(QUERY)
   } else {
      const QUERY = `
         SELECT
            *
         FROM
            verses 
         WHERE
           ARRAY[verse_id::int] && ARRAY[${verseIds}]
         ORDER BY
            verse_id;
      `;

      return fetchALL(QUERY)
   }

   // const QUERY = `
   //    SELECT
   //       *
   //    FROM
   //       verses
   //    WHERE
   //       ARRAY[verse_id::int] && ARRAY[${verseIds}];
   // `;

   return fetchALL(QUERY)
}
const addUpdated = (quran_version, verse_id) => {
   const QUERY = `
      INSERT INTO
         quran_updates (
            quran_version,
            verse_id
         ) VALUES (
            $1,
            $2
         ) RETURNING *;
   `;

   return fetch(
      QUERY,
      quran_version,
      verse_id
   )
}
const foundQuranUpdateds = (version_id) => {
   const QUERY = `
      SELECT
         *
      FROM
         quran_updates
      WHERE
         version_id = $1
   `;

   return fetch(QUERY, version_id)
}
const updateQuranUpdated = (
   version_id,
   quran_version,
   verse_id
) => {
   const QUERY = `
      UPDATE
         quran_updates
      SET
         quran_version = $2,
         verse_id = $3
      WHERE
         version_id = $1
      RETURNING *;
   `;

   return fetch(
      QUERY,
      version_id,
      quran_version,
      verse_id
   )
}
const deleteQuranUpdated = (version_id) => {
   const QUERY = `
      DELETE FROM
         quran_updates
      WHERE
         version_id = $1
      RETURNING *;
   `;

   return fetch(QUERY, version_id)
}
const versionsByLimit = (limit, page) => {
   const QUERY = `
      SELECT
         *
      FROM
         versions
      ORDER BY
         version_id DESC
      LIMIT ${limit}
      OFFSET ${Number((page - 1) * limit)}
   `;

   return fetchALL(QUERY)
}
const versionsUpdates = () => {
   const QUERY = `
      SELECT
         *
      FROM
         versions
      ORDER BY
         version_id DESC
      LIMIT 1;
   `;

   return fetch(QUERY)
}
const quranLastVersion = () => {
   const QUERY = `
      SELECT
         *
      FROM
         quran_updates
      ORDER BY
         version_id DESC
   `;

   return fetch(QUERY)
}
const addVersion = (
   zikr_version,
   names_99_version,
   audios_version,
   meditation_votes,
   meditation_categories
) => {
   const QUERY = `
      INSERT INTO
         versions (
            zikr_version,
            names_99_version,
            audios_version,
            meditation_votes,
            meditation_categories
         ) VALUES (
            $1,
            $2,
            $3,
            $4,
            $5
         ) RETURNING *;
   `;

   return fetch(
      QUERY,
      zikr_version,
      names_99_version,
      audios_version,
      meditation_votes,
      meditation_categories
   )
}
const updateVersion = (
   version_id,
   zikr_version,
   names_99_version,
   audios_version,
   meditation_votes,
   meditation_categories
) => {
   const QUERY = `
      UPDATE
         versions
      SET
         zikr_version = $2,
         names_99_version = $3,
         audios_version = $4,
         meditation_votes = $5,
         meditation_categories = $6
      WHERE
         version_id = $1
      RETURNING *;
   `;

   return fetch(
      QUERY,
      version_id,
      zikr_version,
      names_99_version,
      audios_version,
      meditation_votes,
      meditation_categories
   )
}
const deleteVersion = (version_id) => {
   const QUERY = `
      DELETE FROM
         versions
      WHERE
         version_id = $1
      RETURNING *;
   `

   return fetch(QUERY, version_id)
}

module.exports = {
   quranUpdatesByLimit,
   quranUpdates,
   getUpdates,
   getUpdatedVerse,
   addUpdated,
   foundQuranUpdateds,
   updateQuranUpdated,
   deleteQuranUpdated,
   versionsByLimit,
   versionsUpdates,
   addVersion,
   updateVersion,
   deleteVersion,
   quranLastVersion
}