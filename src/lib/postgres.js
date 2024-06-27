const { Pool } = require("pg");
const { connection } = require("../config");

const credentials = {
  user: "postgres",
  host: "localhost",
  database: "qiblah_v2",
  password: "behad2024",
  port: 5432,
};

const pool = new Pool(credentials);

const fetch = async (SQL, ...params) => {
  const client = await pool.connect();
  try {
    const {
      rows: [row],
    } = await client.query(SQL, params.length ? params : null);
    return row;
  } finally {
    client.release();
  }
};

const fetchALL = async (SQL, ...params) => {
  const client = await pool.connect();
  try {
    const { rows } = await client.query(SQL, params.length ? params : null);
    return rows;
  } finally {
    client.release();
  }
};

module.exports = {
  fetch,
  fetchALL,
};