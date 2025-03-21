CREATE TABLE admins (
   admin_id bigserial PRiMARY KEY,
   admin_email text not null,
   admin_password text not null,
   admin_create_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
   user_id bigserial PRiMARY KEY,
   user_phone_number text,
   user_email text,
   user_password text,
   user_name text,
   user_gender text,
   user_signin_method text,
   user_extra_auth_id text,
   user_country_code text,
   user_region text,
   user_location text,
   user_address_name text,
   user_location_status int DEFAULT 0,
   user_app_lang text,
   user_phone_model text [],
   user_phone_lang text [],
   user_os text [],
   user_os_version text [],
   user_token text [],
   user_comment text [],
   user_premium boolean DEFAULT false,
   user_premium_expires_at text,
   user_image_link text,
   user_image_name text,
   user_app_version int DEFAULT 0,
   user_notification_id text,
   user_notification boolean DEFAULT false,
   payment_type text,
   payment_tracking json [],
   tracking text [],
   chat_id bigint,
   bot_step text,
   user_create_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

-- SELECT user_id, user_phone_lang, ARRAY(SELECT DISTINCT UNNEST(user_phone_lang)) AS cleaned_app_lang
-- FROM users
-- WHERE array_length(user_phone_lang, 1) > 1
--   AND user_phone_lang != (SELECT ARRAY(SELECT DISTINCT UNNEST(user_phone_lang))) Limit 10;
-- UPDATE users
-- SET user_phone_lang = array_to_string(ARRAY(SELECT DISTINCT UNNEST(string_to_array(user_phone_lang, ','))), ',')
-- WHERE array_length(string_to_array(user_phone_lang, ','), 1) > 1
--   AND user_phone_lang != array_to_string(ARRAY(SELECT DISTINCT UNNEST(string_to_array(user_phone_lang, ','))), ',');
CREATE TABLE users_stats (
   id bigserial PRiMARY KEY,
   user_id int REFERENCES users(user_id) ON DELETE CASCADE,
   user_qazo json,
   verse_id int [],
   read_verse int [],
   name_count json [],
   zikr_id int [],
   zikr_count json [],
   user_stat_create_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE quran (
   sura_id bigserial PRiMARY KEY,
   sura_name_arabic text,
   sura_name_uzbek text,
   sura_name_cyrillic text,
   sura_name_russian text,
   sura_name_english text,
   sura_name_kazakh text,
   sura_verse_count int,
   sura_from int,
   sura_create_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE verses (
   verse_id bigserial PRiMARY KEY,
   sura_number int,
   verse_number int,
   juz_number int,
   juz_divider_text text,
   verse_arabic text,
   verse_uzbek text,
   verse_meaning_uzbek text,
   verse_cyrillic text,
   verse_meaning_cyrillic text,
   verse_russian text,
   verse_meaning_russian text,
   verse_english text,
   verse_meaning_english text,
   verse_kazakh text,
   verse_meaning_kazakh text,
   favourite_count int DEFAULT 0,
   sura_id int REFERENCES quran(sura_id) ON DELETE CASCADE,
   verse_create_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE authors (
   author_id bigserial PRiMARY KEY,
   author_name text not null,
   author_image_url text,
   author_image_name text,
   author_create_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE audios (
   audio_id bigserial PRiMARY KEY,
   audio_link text,
   audio_name text,
   author_id int REFERENCES authors(author_id) ON DELETE CASCADE,
   audio_time text [],
   sura_id int REFERENCES quran(sura_id) ON DELETE CASCADE,
   audio_create_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE names_99 (
   name_id bigserial PRiMARY KEY,
   name_arabic text not null,
   name_title_uzbek text,
   name_description_uzbek text,
   name_translation_uzbek text,
   name_title_cyrillic text,
   name_description_cyrillic text,
   name_translation_cyrillic text,
   name_title_russian text,
   name_description_russian text,
   name_translation_russian text,
   name_title_english text,
   name_description_english text,
   name_translation_english text,
   name_title_kazakh text,
   name_description_kazakh text,
   name_translation_kazakh text,
   name_audio_link text,
   name_audio_name text,
   name_create_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE zikr_categories (
   category_id bigserial PRiMARY KEY,
   category_name text not null,
   category_lang text not null,
   category_version int DEFAULT 0,
   category_background_color text,
   category_text_color text,
   category_image_link text,
   category_image_name text,
   category_create_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE zikrs (
   zikr_id bigserial PRiMARY KEY,
   zikr_title text,
   zikr_description text,
   zikr_info text,
   zikr boolean DEFAULT true,
   zikr_daily_count int,
   zikr_audio_link text,
   zikr_audio_name text,
   favourite_count int DEFAULT 0,
   category_id int REFERENCES zikr_categories(category_id) ON DELETE CASCADE,
   zikr_create_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public_zikr (
   zikr_id bigserial PRiMARY KEY,
   zikr_title_uzbek text,
   zikr_description_uzbek text,
   zikr_info_uzbek text,
   zikr_title_cyrillic text,
   zikr_description_cyrillic text,
   zikr_info_cyrillic text,
   zikr_title_russian text,
   zikr_description_russian text,
   zikr_info_russian text,
   zikr_title_english text,
   zikr_description_english text,
   zikr_info_english text,
   zikr_title_kazakh text,
   zikr_description_kazakh text,
   zikr_info_kazakh text,
   zikr_current_count int DEFAULT 0,
   zikr_count int,
   zikr_participants int DEFAULT 0,
   zikr_finishing boolean DEFAULT false,
   supporter_lang text [],
   zikr_audio_link text,
   zikr_audio_name text,
   zikr_create_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users_zikr (
   id bigserial PRiMARY KEY,
   user_id int REFERENCES users(user_id) ON DELETE CASCADE,
   zikr_id int REFERENCES public_zikr(zikr_id) ON DELETE CASCADE,
   create_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE price_list (
   price_item_id bigserial PRiMARY KEY,
   price_yearly_dollar NUMERIC(10, 2),
   price_yearly_sum NUMERIC(10, 2),
   price_monthly_dollar NUMERIC(10, 2),
   price_monthly_sum NUMERIC(10, 2),
   comments json [],
   features_uzbek text [],
   features_cyrillic text [],
   features_russian text [],
   features_english text [],
   features_kazakh text [],
   privacy_policy_link text,
   terms_condition_link text,
   bot_link text,
   email_link text,
   price_item_ads boolean DEFAULT false,
   price_item_string text,
   ads_country json,
   price_item_create_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE news (
   news_id bigserial PRiMARY KEY,
   news_title text,
   news_description text,
   news_button_text text,
   news_link text,
   news_lang text,
   news_image_link text,
   news_image_name text,
   news_like int DEFAULT 0,
   news_views int DEFAULT 0,
   news_active boolean DEFAULT true,
   news_create_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users_news (
   id bigserial PRiMARY KEY,
   user_id int REFERENCES users(user_id) ON DELETE CASCADE,
   news_id int REFERENCES news(news_id) ON DELETE CASCADE,
   create_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE second_news (
   news_id bigserial PRiMARY KEY,
   news_title text,
   news_description text,
   news_button_text text,
   news_link text,
   news_lang text,
   news_image_link text,
   news_image_name text,
   news_like int DEFAULT 0,
   news_views int DEFAULT 0,
   user_id text [],
   r text [],
   os text,
   gender text,
   news_order int,
   payment_type boolean DEFAULT false,
   news_active boolean DEFAULT true,
   news_create_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users_second_news (
   id bigserial PRiMARY KEY,
   user_id int REFERENCES users(user_id) ON DELETE CASCADE,
   news_id int REFERENCES second_news(news_id) ON DELETE CASCADE,
   create_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE photos (
   id bigserial PRiMARY KEY,
   image_link text,
   image_name text,
   create_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tapes (
   tape_id bigserial PRiMARY KEY,
   tape_date text,
   verse_id int,
   zikr_id json,
   name_id int,
   dua_id json,
   news_id int [],
   tape_create_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE quran_updates (
   version_id bigserial PRiMARY KEY,
   quran_version int DEFAULT 1,
   verse_id int [],
   version_create_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE versions (
   version_id bigserial PRiMARY KEY,
   zikr_version int DEFAULT 1,
   names_99_version int DEFAULT 1,
   audios_version int DEFAULT 1,
   meditation_votes int DEFAULT 1,
   meditation_categories int DEFAULT 1,
   meditation_item int DEFAULT 1,
   version_create_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE messages (
   message_id bigserial PRiMARY KEY,
   chat_id text,
   message_dete int
);

CREATE TABLE meditation_categories (
   category_id bigserial PRiMARY KEY,
   category_name text not null,
   category_lang text not null,
   category_create_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE meditation_item (
   item_id bigserial PRiMARY KEY,
   item_name text not null,
   item_description text,
   category_id int REFERENCES meditation_categories(category_id) ON DELETE CASCADE,
   item_time text,
   item_audio_url text,
   item_audio_name text,
   suggested_item boolean DEFAULT false,
   item_create_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE additional_votes (
   vote_id bigserial PRiMARY KEY,
   vote_name text not null,
   vote_lang text not null,
   vote_audio_url text,
   vote_audio_name text,
   vote_icon_url text,
   vote_icon_name text,
   suggested_item boolean DEFAULT false,
   vote_create_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE map_key (
   key_id bigserial PRiMARY KEY,
   key text not null,
   type text,
   key_create_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE transactions (
   id bigserial PRiMARY KEY,
   click_id text,
   amount text,
   expires_month int,
   tarif text,
   user_id int,
   merchant_id text,
   error text,
   error_note text,
   user_token text,
   status text,
   transaction_create_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE uzum (
   id bigserial PRiMARY KEY,
   user_id int,
   user_token text,
   trans_id text,
   expires_month int,
   amount int,
   tarif text,
   ilova text,
   status text,
   transaction_create_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE payme (
   id bigserial PRiMARY KEY,
   user_id int,
   user_token text,
   payment text,
   state int DEFAULT 0,
   amount int,
   create_time bigint DEFAULT 0,
   perform_time bigint DEFAULT 0,
   cancel_time bigint DEFAULT 0,
   transaction text,
   reason int,
   ilova text,
   transaction_create_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE payment_categories (
   category_id bigserial PRiMARY key,
   category_name text,
   month int,
   category_create_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE payment (
   id bigserial PRiMARY key,
   name text,
   price NUMERIC(10, 2),
   create_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE languages (
   id bigserial PRiMARY KEY,
   name text,
   lang_create_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE pray_categories (
   category_id bigserial PRiMARY KEY,
   category_name text,
   category_description text,
   category_text_color text,
   category_description_color text,
   category_background_color text,
   category_big int DEFAULT 0,
   category_gender int DEFAULT 0,
   category_order int,
   lang_id int REFERENCES languages(id) ON DELETE CASCADE,
   category_image_link text,
   category_image_name text,
   category_create_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sub_categories (
   sub_category_id bigserial PRiMARY KEY,
   sub_category_name text,
   sub_category_image_link text,
   sub_category_image_name text,
   have_item int DEFAULT 0,
   numeric int DEFAULT 0,
   category_id int REFERENCES pray_categories(category_id) ON DELETE CASCADE,
   category_create_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE duos (
   id bigserial PRiMARY KEY,
   title text,
   text text,
   translation text,
   audio_link text,
   audio_name text,
   zam_sura boolean DEFAULT false,
   lang_id int REFERENCES languages(id) ON DELETE CASCADE,
   create_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE elements (
   id bigserial PRiMARY KEY,
   title text,
   text_1 text,
   text_2 text,
   zam_suras int,
   image_link text,
   image_name text,
   audio_link text,
   audio_name text,
   duo_1 int,
   duo_2 int,
   duo_3 int,
   sub_category_id int REFERENCES sub_categories(sub_category_id) ON DELETE CASCADE,
   create_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

-- old
CREATE TABLE question_categories (
   category_id bigserial PRiMARY KEY,
   category_name text not null,
   category_lang text not null,
   category_create_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE questions (
   question_id bigserial PRiMARY KEY,
   question_title text not null,
   question text not null,
   answer text not null,
   source text,
   category_id int REFERENCES question_categories(category_id) ON DELETE CASCADE,
   question_create_at timestamptz DEFAULT CURRENT_TIMESTAMP
);