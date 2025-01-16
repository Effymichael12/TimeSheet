require('dotenv').config();
const Pool = require('pg').Pool;

const pool = new Pool({
  user: process.env.DATA_USER,
  "password":process.env.DATA_PASS,
  "host": process.env.DATA_HOST,
  "port": process.env.DATA_PORT,
  "database":process.env.DATABASE
})
module.exports = pool;