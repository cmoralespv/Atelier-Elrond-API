require('dotenv').config();

const sql = require('../src/config/db_config');

const product_id = 100;
const rating = 5;
const summary = 'summary success';
const body = 'body success';
const recommend = true;
const reviewer_name = 'tester';
const reviewer_email = 'tester@jest.com';
const photos = "['url1', 'url2', 'url3', 'url4', 'url5']";
const characteristics = '{"101":2,"102":3,"103":2,"104":4}';

beforeAll(() =>
  sql.query(
    `CREATE TABLE IF NOT EXISTS  reviews (
      review_id  SERIAL  PRIMARY KEY,
      product_Id  INTEGER  NOT NULL,
      rating  SMALLINT,
      date  TIMESTAMPTZ  NOT NULL DEFAULT now(),
      summary  VARCHAR(200)  NOT NULL,
      body  VARCHAR(1000)  NOT NULL,
      recommend  BOOLEAN  NOT NULL  DEFAULT FALSE,
      reported  BOOLEAN  NOT NULL  DEFAULT FALSE,
      reviewer_name  VARCHAR(60)  NOT NULL,
      reviewer_email  VARCHAR(60)  NOT NULL,
      response  VARCHAR(1000)  NOT NULL,
      helpfulness  INTEGER  NOT NULL  DEFAULT 0,
      photos  TEXT  NOT NULL  DEFAULT '')`
  ).then(() => sql.query(
    `CREATE TABLE IF NOT EXISTS  characteristics (
      id  SERIAL  PRIMARY KEY,
      product_id  INTEGER  NOT NULL,
      name  VARCHAR(60)  NOT NULL)`
  )).then(() => sql.query(
    `CREATE TABLE IF NOT EXISTS  characteristic_reviews (
      id  SERIAL  PRIMARY KEY,
      characteristic_id  INTEGER  NOT NULL,
      review_id  INTEGER  NOT NULL,
      value  SMALLINT)`
  )).then(() => sql.query(
    `CREATE TABLE IF NOT EXISTS  reviews_photos (
      id SERIAL  PRIMARY KEY,
      review_id  INTEGER  NOT NULL,
      url  VARCHAR(300)  NOT NULL)`
  ))
);

afterAll(done => sql.end(done));

// exports.pid = product_id;

// .then(() => sql.query(`
//     WITH review AS (
//       INSERT INTO reviews (product_id , rating , summary, body, recommend, reviewer_name, reviewer_email)
//       VALUES (${product_id}, ${rating}, '${summary}', '${body}', '${recommend}', '${reviewer_name}', '${reviewer_email}')
//       RETURNING review_id),
//     photos AS (
//       INSERT INTO reviews_photos(review_id, url)
//       SELECT review_id, url
//       FROM review CROSS JOIN UNNEST (ARRAY [${photos}]::VARCHAR[]) AS t (url) RETURNING id)
//     INSERT INTO characteristic_reviews (review_id, characteristic_id, value)
//       SELECT review_id, characteristic_id, value
//         FROM review CROSS JOIN (SELECT json_data.key::integer AS characteristic_id, json_data.value::text::smallint AS value
//         FROM json_each('${characteristics}') AS json_data) as t;`)
//   )

