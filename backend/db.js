const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'booking_app',
  password: 'Chris_2002',
  port: 5432,
});

module.exports = pool;