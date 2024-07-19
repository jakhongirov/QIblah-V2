const { fetch, fetchALL } = require('../../lib/postgres')

const getAdminUsers = (limit, page) => {
   const QUERY = `
      SELECT
         *
      FROM
         users
      ORDER BY
         user_id DESC
      LIMIT ${limit}
      OFFSET ${Number((page - 1) * limit)};
   `;

   return fetchALL(QUERY)
}
const userCount = () => {
   const QUERY = `
      SELECT
         count(user_id)
      FROM
         users;
   `;

   return fetch(QUERY)
}
const userCountMale = () => {
   const QUERY = `
      SELECT
         count(user_id)
      FROM
         users
      WHERE
         user_gender = 'Erkak';
   `;

   return fetch(QUERY)
}
const userCountFemale = () => {
   const QUERY = `
      SELECT
         count(user_id)
      FROM
         users
      WHERE
         user_gender = 'Ayol';
   `;

   return fetch(QUERY)
}
const userNotificationTrue = () => {
   const QUERY = `
      SELECT
         count(user_id)
      FROM
         users
      WHERE
         user_notification = true;
   `;

   return fetch(QUERY)
}
const userNotificationFalse = () => {
   const QUERY = `
      SELECT
         count(user_id)
      FROM
         users
      WHERE
         user_notification = false;
   `;

   return fetch(QUERY)
}
const userLocationStatus1 = () => {
   const QUERY = `
      SELECT
         count(user_id)
      FROM
         users
      WHERE
         user_location_status = 1;
   `;

   return fetch(QUERY)
}
const userLocationStatus2 = () => {
   const QUERY = `
      SELECT
         count(user_id)
      FROM
         users
      WHERE
         user_location_status = 2;
   `;

   return fetch(QUERY)
}
const userLocationStatus3 = () => {
   const QUERY = `
      SELECT
         count(user_id)
      FROM
         users
      WHERE
         user_location_status = 3;
   `;

   return fetch(QUERY)
}
const userPremium = () => {
   const QUERY = `
      SELECT
         count(user_id)
      FROM
         users
      WHERE
         user_premium = true;
   `;

   return fetch(QUERY)
}
const getUserPremiumList = (limit, page) => {
   const QUERY = `
      SELECT
         *
      FROM
         users
      WHERE
         user_premium = true
      ORDER BY
         user_id DESC
      LIMIT ${limit}
      OFFSET ${Number((page - 1) * limit)};
   `;

   return fetchALL(QUERY)
}
const checkUserById = (id) => {
   const QUERY = `
      SELECT
         *
      FROM
         users
      WHERE
         user_id = $1;
   `;

   return fetch(QUERY, id)
}
const foundUserByToken = async (user_token) => {
   console.log("query", user_token);
   const QUERY = `
     SELECT
       *
     FROM
       users
     WHERE
       $1 = ANY (user_token);
   `;

   return await fetch(QUERY, [user_token]);
}
const addTracking = (user_id, currentTime) => {
   const QUERY = `
      UPDATE
         users
      SET
         tracking = array_append(tracking, $2)
      WHERE
         user_id = $1
      RETURNING *;
   `;

   return fetch(QUERY, user_id, currentTime)
}
const userSearch = (phone_number, user_name, user_gender) => {
   const QUERY = `
      SELECT
         *
      FROM
         users
      WHERE
      ${phone_number && user_name && user_gender ? (
         `user_phone_number ilike '%${phone_number}%' and user_name ilike '%${user_name}%' and user_gender ilike '%${user_gender}%'`
      ) : phone_number && user_name ? (
         `user_phone_number ilike '%${phone_number}%' and user_name ilike '%${user_name}%'`
      ) : phone_number ? (
         `user_phone_number ilike '%${phone_number}%'`
      ) : user_name ? (
         `user_name ilike '%${user_name}%'`
      ) : user_gender ? (
         `user_gender ilike '%${user_gender}%'`
      ) : ""
      };
   `;

   return fetchALL(QUERY)
}
const checkUserEmail = (user_email) => {
   const QUERY = `
      SELECT
         *
      FROM
         users
      WHERE
         user_email = $1;
   `;

   return fetch(QUERY, user_email)
}
const checkUserPhoneNumber = (user_phone_number) => {
   const QUERY = `
      SELECT
         *
      FROM
         users
      WHERE
         user_phone_number = $1;
   `;

   return fetch(QUERY, user_phone_number)
}
const checkUserMethod = (user_signin_method, user_extra_auth_id) => {
   const QUERY = `
      SELECT
         *
      FROM
         users
      WHERE
         user_signin_method = $1 and user_extra_auth_id = $2;
   `;

   return fetch(QUERY, user_signin_method, user_extra_auth_id)
}
const registerUser = (
   user_phone_number,
   user_email,
   pass_hash,
   user_name,
   user_gender,
   user_signin_method,
   user_extra_auth_id,
   user_country_code,
   user_region,
   user_location,
   user_app_lang,
   user_phone_model,
   user_phone_lang,
   user_os,
   user_os_version,
   user_token,
   user_app_version,
   notification_id,
   notification,
   location_status,
   user_address_name
) => {
   const QUERY = `
      INSERT INTO
         users (
            user_phone_number,
            user_email,
            user_password,
            user_name,
            user_gender,
            user_signin_method,
            user_extra_auth_id,
            user_country_code,
            user_region,
            user_location,
            user_app_lang,
            user_phone_model,
            user_phone_lang,
            user_os,
            user_os_version,
            user_token,
            user_app_version,
            user_notification_id,
            user_notification,
            user_location_status,
            user_address_name
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
            ARRAY [ $12 ],
            ARRAY [ $13 ],
            ARRAY [ $14 ],
            ARRAY [ $15 ],
            ARRAY [ $16 ],
            $17,
            $18,
            $19,
            $20,
            $21
         ) RETURNING *;
   `;

   return fetch(
      QUERY,
      user_phone_number,
      user_email,
      pass_hash,
      user_name,
      user_gender,
      user_signin_method,
      user_extra_auth_id,
      user_country_code,
      user_region,
      user_location,
      user_app_lang,
      user_phone_model,
      user_phone_lang,
      user_os,
      user_os_version,
      user_token,
      user_app_version,
      notification_id,
      notification,
      location_status,
      user_address_name
   )
}
const createTemporaryUser = (
   user_name,
   user_gender,
   user_country_code,
   user_region,
   user_location,
   user_app_lang,
   user_phone_model,
   user_phone_lang,
   user_os,
   user_os_version,
   user_token,
   user_app_version,
   notification_id,
   notification,
   location_status,
   user_address_name
) => {
   const QUERY = `
      INSERT INTO
         users (
            user_name,
            user_gender,
            user_country_code,
            user_region,
            user_location,
            user_app_lang,
            user_phone_model,
            user_phone_lang,
            user_os,
            user_os_version,
            user_token,
            user_app_version,
            user_notification_id,
            user_notification,
            user_location_status,
            user_address_name
         ) VALUES (
            $1,
            $2,
            $3,
            $4,
            $5,
            $6,
            ARRAY [ $7 ],
            ARRAY [ $8 ],
            ARRAY [ $9 ],
            ARRAY [ $10 ],
            ARRAY [ $11 ],
            $12,
            $13,
            $14,
            $15,
            $16
         ) RETURNING *;
   `;

   return fetch(
      QUERY,
      user_name,
      user_gender,
      user_country_code,
      user_region,
      user_location,
      user_app_lang,
      user_phone_model,
      user_phone_lang,
      user_os,
      user_os_version,
      user_token,
      user_app_version,
      notification_id,
      notification,
      location_status,
      user_address_name
   )
}
const addToken = (
   user_id,
   user_token,
   user_app_version,
   user_premium,
   payment_type,
   user_premium_expires_at,
   user_country_code,
   user_region,
   user_location,
   user_address_name,
   user_location_status,
   tracking
) => {
   // Handle null tracking by setting it to an empty array
   if (tracking == null) {
      tracking = [];
   }

   const QUERY = `
      UPDATE
         users
      SET
         user_token = array_append(user_token, $2),
         user_app_version = $3,
         user_premium = $4,
         payment_type = $5,
         user_premium_expires_at = $6,
         user_country_code = $7,
         user_region = $8,
         user_location = $9,
         user_address_name = $10,
         user_location_status = $11,
         tracking = array_append(tracking, $12)
      WHERE
         user_id = $1
      RETURNING *;
   `;

   return fetch(
      QUERY,
      user_id,
      user_token,
      user_app_version,
      user_premium,
      payment_type,
      user_premium_expires_at,
      user_country_code,
      user_region,
      user_location,
      user_address_name,
      user_location_status,
      tracking
   );
}
const editUserAvatar = (user_id, imageUrl, imageName) => {
   const QUERY = `
      UPDATE
         users
      SET
         user_image_link = $2,
         user_image_name = $3
      WHERE
         user_id = $1
      RETURNING *;
   `;

   return fetch(QUERY, user_id, imageUrl, imageName)
}
const editUser = (user_id, user_email, user_phone_number, pass_hash) => {
   const QUERY = `
      UPDATE
         users
      SET
         user_email = $2,
         user_phone_number = $3,
         user_password = $4
      WHERE
         user_id = $1
      RETURNING *;
   `;

   return fetch(QUERY, user_id, user_email, user_phone_number, pass_hash)
}
const editUserName = (user_id, user_name, user_gender, user_phone_number) => {
   const QUERY = `
      UPDATE
         users
      SET
         user_name = $2,
         user_gender = $3,
         user_phone_number = $4
      WHERE
         user_id = $1
      RETURNING *;
   `;

   return fetch(QUERY, user_id, user_name, user_gender, user_phone_number)
}
const editUserQaza = (user_id, user_qaza) => {
   const QUERY = `
      UPDATE
         users
      SET
         user_qaza = array_append(user_qaza, $2)
      WHERE
         user_id = $1
      RETURNING *;
   `;

   return fetch(QUERY, user_id, user_qaza)
}
const editUserLocation = (
   user_id,
   user_location,
   user_region,
   user_country_code,
   location_status,
   user_address_name
) => {
   const QUERY = `
      UPDATE
         users
      SET
      user_location = $2,
         user_region = $3,
         user_country_code = $4,
         user_location_status = $5,
         user_address_name = $6
      WHERE
         user_id = $1
      RETURNING *;
   `;

   return fetch(
      QUERY,
      user_id,
      user_location,
      user_region,
      user_country_code,
      location_status,
      user_address_name
   )
}
const editUserPhoneDetails = (
   user_id,
   user_phone_model,
   user_phone_lang,
   user_os,
   user_os_version
) => {
   const QUERY = `
      UPDATE
         users
      SET
         user_phone_model = array_append(user_phone_model, $2),
         user_phone_lang = array_append(user_phone_lang, $3),
         user_os = array_append(user_os, $4),
         user_os_version = array_append(user_os_version, $5)
      WHERE
         user_id = $1
      RETURNING *;
   `;

   return fetch(
      QUERY,
      user_id,
      user_phone_model,
      user_phone_lang,
      user_os,
      user_os_version
   )
}
const editUserAbout = (user_id, user_comment) => {
   const QUERY = `
      UPDATE
         users
      SET
         user_comment = array_append(user_comment, $2)
      WHERE
         user_id = $1
      RETURNING *;
   `;

   return fetch(QUERY, user_id, user_comment)
}
const editUserPremium = (user_id, user_premium, expires_at, payment_type) => {
   const QUERY = `
      UPDATE
         users
      SET
         user_premium = $2,
         user_premium_expires_at = $3,
         payment_type = $4
      WHERE
         user_id = $1
      RETURNING *;
   `;

   return fetch(QUERY, user_id, user_premium, expires_at, payment_type)
}
const changeLang = (user_id, lang) => {
   const QUERY = `
      UPDATE
         users
      SET
         user_app_lang = $2
      WHERE
         user_id = $1
      RETURNING *;
   `;

   return fetch(QUERY, user_id, lang)
}
const updateUserAllData = (
   user_id,
   user_name,
   user_gender,
   user_country_code,
   user_region,
   user_location,
   user_app_lang,
   user_phone_model,
   user_phone_lang,
   user_os,
   user_os_version,
   user_comment,
   user_app_version,
   user_address_name
) => {
   const QUERY = `
      UPDATE
         users
      SET
         user_name = $2,
         user_gender = $3,
         user_country_code = $4,
         user_region = $5,
         user_location = $6,
         user_app_lang = $7,
         user_phone_model = array_append(user_phone_model, $8),
         user_phone_lang = array_append(user_phone_lang, $9),
         user_os = array_append(user_os, $10),
         user_os_version = array_append(user_os_version, $11),
         user_comment = array_append(user_comment, $12),
         user_app_version = $13,
         user_address_name = $14
      WHERE
         user_id = $1
      RETURNING *;
   `;

   return fetch(
      QUERY,
      user_id,
      user_name,
      user_gender,
      user_country_code,
      user_region,
      user_location,
      user_app_lang,
      user_phone_model,
      user_phone_lang,
      user_os,
      user_os_version,
      user_comment,
      user_app_version,
      user_address_name
   )
}
const foundUserStat = (user_id) => {
   const QUERY = `
      SELECT
         *
      FROM
         users_stats
      WHERE
         user_id = $1;
   `;

   return fetch(QUERY, user_id)
}
const editUserStats = (
   user_id,
   user_qazo,
   verse_id,
   read_verse,
   name_count,
   zikr_id,
   zikr_count
) => {
   const QUERY = `
      UPDATE
         users_stats
      SET
         user_qazo = $2,
         verse_id = $3,
         read_verse = $4,
         name_count = $5,
         zikr_id = $6,
         zikr_count = $7
      WHERE
         user_id = $1
      RETURNING *;
   `;

   return fetch(
      QUERY,
      user_id,
      user_qazo,
      verse_id,
      read_verse,
      name_count,
      zikr_id,
      zikr_count
   )
}
const addUserStats = (
   user_id,
   user_qazo,
   verse_id,
   read_verse,
   name_count,
   zikr_id,
   zikr_count
) => {
   const QUERY = `
      INSERT INTO
         users_stats (
            user_id,
            user_qazo,
            verse_id,
            read_verse,
            name_count,
            zikr_id,
            zikr_count
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
      user_id,
      user_qazo,
      verse_id,
      read_verse,
      name_count,
      zikr_id,
      zikr_count
   )
}
const updateVerseFavCount = (item) => {
   const QUERY = `
      UPDATE
         verses
      SET
         favourite_count = favourite_count + 1
      WHERE
         verse_id = $1
      RETURNING *;
   `;

   return fetch(QUERY, item)
}
const updateZikrFavCount = (item) => {
   const QUERY = `
      UPDATE
         zikrs
      SET
         favourite_count = favourite_count + 1
      WHERE
         zikr_id = $1
      RETURNING *;
   `;

   return fetch(QUERY, item)
}
const deleteUser = (user_id) => {
   const QUERY = `
      DELETE FROM
         users
      WHERE
         user_id = $1
      RETURNING *;
   `;

   return fetch(QUERY, user_id)
}

module.exports = {
   getAdminUsers,
   userCount,
   userCountMale,
   userCountFemale,
   userNotificationTrue,
   userNotificationFalse,
   userLocationStatus1,
   userLocationStatus2,
   userLocationStatus3,
   userPremium,
   getUserPremiumList,
   checkUserById,
   foundUserByToken,
   addTracking,
   userSearch,
   checkUserEmail,
   checkUserPhoneNumber,
   checkUserMethod,
   registerUser,
   createTemporaryUser,
   addToken,
   editUserAvatar,
   editUser,
   editUserName,
   editUserQaza,
   editUserLocation,
   editUserPhoneDetails,
   editUserAbout,
   editUserPremium,
   changeLang,
   updateUserAllData,
   foundUserStat,
   editUserStats,
   addUserStats,
   updateVerseFavCount,
   updateZikrFavCount,
   deleteUser
}