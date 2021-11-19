const { Client } = require('pg');

const sql = new Client({
  user: '',
  host: 'localhost',
  database: 'ratings_and_reviews',
  password: '',
  port: 5432,
});

sql.connect();

sql.query('SELECT $1::text as message', ['Hello world, connected to database!'], (err, res) => {
  console.log(err ? err.stack : res.rows[0].message); // Hello World!
});

module.exports = sql;
