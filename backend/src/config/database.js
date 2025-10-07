/**
 * Establishes and exports the connection pool for the PostgreSQL database. This module centralizes database connection management.
 */

const { Pool } = require('pg');

require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Error connecting to database:', err.stack);
    return;
  }
  
  console.log('✅ Database connected successfully!');
  
  release();
});

module.exports = pool;