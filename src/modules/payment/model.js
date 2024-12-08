const { fetch, fetchALL } = require('../../lib/postgres')

const categories = () => {
   const QUERY = `
      SELECT
         *
      FROM
         payment_categories
      ORDER BY
         category_id DESC;
   `;

   return fetchALL(QUERY)
}
const addCategory = (category_name, month) => {
   const QUERY = `
      INSERT INTO
         payment_categories (
            category_name,
            month
         ) VALUES (
            $1,
            $2
         ) RETURNING *;
   `;

   return fetch(QUERY, category_name, month)
}
const updateCategory = (
   id,
   category_name,
   month
) => {
   const QUERY = `
      UPDATE
         payment_categories
      SET
         category_name = $2,
         month = $3
      WHERE
         category_id = $1
      RETURNING *;
   `;

   return fetch(
      QUERY,
      id,
      category_name,
      month
   )
}
const deleteCategory = (id) => {
   const QUERY = `
      DELETE FROM
         payment_categories
      WHERE
         category_id = $1
      RETURNING *;
   `;

   return fetch(QUERY, id)
}

// PAYMENT PRICE
const payment = () => {
   const QUERY = `
      SELECT
         *
      FROM  
         payment
   `;

   return fetchALL(QUERY)
}
const addPayment = (name, price) => {
   const QUERY = `
      INSERT INTO
         payment (
            name,
            price   
         ) VALUES (
            $1, 
            $2 
         ) RETURNIG *;
   `;

   return fetch(QUERY, name, price)
}
const editPayment = (
   id,
   price
) => {
   const QUERY = `
      UPDATE
         payment
      SET
         price = $2
      WHERE
         id = $1
      RETURNING *;
   `;

   return fetch(QUERY, id, price)
}
const deletePayment = (id) => {
   const QUERY = `
      DELETE FROM
         payment
      WHERE
         id = $1
      RETURNING *;
   `;

   return fetch(QUERY, id)
}

// CHECK
const foundUser = (user_id) => {
   const QUERY = `
      SELECT
         *
      FROM
         users
      WHERE
         user_id = $1;
   `;

   return fetch(QUERY, user_id)
}

module.exports = {
   categories,
   addCategory,
   updateCategory,
   deleteCategory,
   payment,
   addPayment,
   editPayment,
   deletePayment,
   foundUser
}