require('dotenv').config();

const sql = require('../src/config/db_config');

beforeAll(() =>
  sql.query(`
    CREATE TABLE IF NOT EXISTS reviews (
      review_id  serial  PRIMARY KEY,
      product_Id  serial  NOT NULL,
      rating  smallint,
      date  bigint  NOT NULL,
      summary  varchar(60)  NOT NULL,
      body  varchar(1000)  NOT NULL,
      recommend  boolean  NOT NULL  DEFAULT FALSE,
      reported  boolean  NOT NULL  DEFAULT FALSE,
      reviewer_name  varchar(60)  NOT NULL,
      reviewer_email  varchar(60)  NOT NULL,
      response  varchar(1000)  NOT NULL,
      helpfulness  integer  NOT NULL  DEFAULT 0,
      photos  text  NOT NULL  DEFAULT ''
    )
  `).then(() => sql.query(`
    CREATE TABLE IF NOT EXISTS characteristics (
      id  serial  PRIMARY KEY,
      product_id  serial  NOT NULL,
      name  varchar(60)  NOT NULL
    )`
  )).then(() => sql.query(`
    CREATE TABLE IF NOT EXISTS characteristic_reviews (
      id  serial  PRIMARY KEY,
      characteristic_id  serial,
      review_id  serial,
      value  smallint
    )
  `)).then(() => sql.query(`
    CREATE TABLE IF NOT EXISTS reviews_photos (
      id serial PRIMARY KEY,
      review_id  serial,
      url  varchar(300)  NOT NULL
    )
  `))
);

afterAll(done => sql.end(done));
