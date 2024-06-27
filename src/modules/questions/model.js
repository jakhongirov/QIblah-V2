const { fetch, fetchALL } = require('../../lib/postgres')

const questionsList = (limit, page) => {
   const QUERY = `
      SELECT
         *
      FROM
         questions
      ORDER BY
         question_id DESC
      LIMIT ${limit}
      OFFSET ${Number((page - 1) * limit)}
   `;

   return fetchALL(QUERY)
}
const questionsByCategories = (categoryId, limit, page) => {
   const QUERY = `
      SELECT
         *
      FROM
         questions a
      INNER JOIN
         question_categories b
      ON
         a.category_id = b.category_id
      WHERE
         a.category_id = $1
      ORDER BY
         question_id DESC
      LIMIT ${limit}
      OFFSET ${Number((page - 1) * limit)}
   `;

   return fetchALL(QUERY, categoryId)
}
const foundQuestion = (id) => {
   const QUERY = `
      SELECT
         *
      FROM
         questions a
      INNER JOIN
         question_categories b
      ON
         a.category_id = b.category_id
      WHERE
         question_id = $1;
   `;

   return fetch(QUERY, id)
}
const addQuestion = (
   question_title,
   question,
   answer,
   source,
   category_id
) => {
   const QUERY = `
      INSERT INTO
         questions (
            question_title,
            question,
            answer,
            source,
            category_id
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
      question_title,
      question,
      answer,
      source,
      category_id
   )
}
const editQuestion = (
   question_id,
   question_title,
   question,
   answer,
   source,
   category_id
) => {
   const QUERY = `
      UPDATE
         questions
      SET
         question_title = $2,
         question = $3,
         answer = $4,
         source = $5,
         category_id = $6
      WHERE
         question_id = $1
      RETURNING *;
   `;

   return fetch(
      QUERY,
      question_id,
      question_title,
      question,
      answer,
      source,
      category_id
   )
}
const deleteQuestion = (question_id) => {
   const QUERY = `
      DELETE FROM
         questions
      WHERE
         question_id = $1
      RETURNING *;
   `;

   return fetch(QUERY, question_id)
}

module.exports = {
   questionsList,
   questionsByCategories,
   foundQuestion,
   addQuestion,
   editQuestion,
   deleteQuestion
}