const compression = require('compression');
const dotenv = require('dotenv');
const express = require('express');
const fs = require('fs');
const http = require('http');
const https = require('https');

dotenv.config();

const sql = require('./src/config/db_config');

sql.query('SELECT $1::text as message', ['Hello world, connected to database!'], (err, res) => {
  console.log(err ? err.stack : res.rows[0].message); // Hello World!
});

const routes = require('./src/api/routes');

const {
  HTTP_PORT,
  HTTPS_PORT,
  HTTPS_KEY,
  HTTPS_CERT
} = process.env;

const app = express();
app.use(compression());
app.use(express.json());

app.use('/loaderio-5c7452623a52615f2c57559e40ee5ddf', (req, res) => {
  const loaderIOfile = fs.readFileSync('./loaderio-5c7452623a52615f2c57559e40ee5ddf.txt', 'utf-8');
  res.send(loaderIOfile);
});

app.use(routes.get);
app.use(routes.post);
app.use(routes.put);

// app.get('/', (req, res) => {
//   res.send('Hello world');
// });

if (HTTP_PORT) {
  http.createServer(app).listen(HTTP_PORT);
  console.log(`server listening on port ${HTTP_PORT}`);
}

if (HTTPS_PORT) {
  https.createServer({
    key: fs.readFileSync(HTTPS_KEY),
    cert: fs.readFileSync(HTTPS_CERT)
  }, app).listen(HTTPS_PORT);
}

module.exports = app;
