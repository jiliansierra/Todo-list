const { Pool } = require('pg');
require('dotenv').config(); // This loads your .env variables

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
});
    
// A quick test to make sure it connects
pool.connect((err, client, release) => {
    if (err) {
        console.error('Error acquiring client', err.stack);
    } else {
        console.log('Successfully connected to PostgreSQL!');
    }
    if (client) release();
});

module.exports = pool;