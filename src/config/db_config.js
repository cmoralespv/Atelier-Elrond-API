const { Client } = require('pg');

const sql = new Client(process.env.DB_URL);
// const sql = new Client({

//   user: '',
//   host: 'localhost',
//   database: 'ratings_and_reviews',
//   password: '',
//   port: 5432,
// });

sql.connect();

module.exports = sql;
