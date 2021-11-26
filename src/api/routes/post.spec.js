const compression = require('compression');
const express = require('express');
const request = require('supertest');
const sql = require('../../config/db_config');
const post = require('./post');
const get = require('./get');
const { newPost } = require('../../../.jest/testingData');

const app = express();
app.use(compression());
app.use(express.json());

app.use(post);
app.use(get);

const newPostWithPhotos = { ...newPost };
newPostWithPhotos.photos = ['https://tinyurl.com/4emkwe9d', 'https://tinyurl.com/3h275xuk'];

const getRow = `SELECT
  CASE
    WHEN EXISTS (SELECT * FROM reviews LIMIT 1)
      THEN (SELECT review_id FROM reviews
      ORDER BY review_id DESC LIMIT 1)
    ELSE 0
  END;`;

// TEST FOR POST: ADD A REVIEW WITHOUT PHOTOS
describe('POST - Add a Review without photos', () => {
  let reviewIdInLastRowBeforePost;
  let reviewIdInLastRowAfterPost;

  beforeAll(async () => {
    const { rows } = await sql.query(getRow);
    reviewIdInLastRowBeforePost = rows[0].case;

    const res = await request(app)
      .post('/reviews/')
      .send(newPost)
      .expect(201);

    expect(res.status).toEqual(201);
    expect(res.statusCode).toBe(201);
  });

  it('should post a new review to the last row in the reviews table', async () => {
    const { rows: newRows } = await sql.query(getRow);
    reviewIdInLastRowAfterPost = newRows[0].case;

    expect(reviewIdInLastRowBeforePost + 1).toEqual(reviewIdInLastRowAfterPost);
  });

  it('should persist all the data inputed by the reviewer, including the timestamp, excluding their email', async () => {
    const { rows } = await sql.query(`SELECT * FROM reviews WHERE review_id = ${reviewIdInLastRowAfterPost};`);

    const recordInLastRow = rows[0];

    expect(recordInLastRow.review_id).toEqual(reviewIdInLastRowAfterPost);
    expect(recordInLastRow.summary).toEqual('summary successful');
    expect(recordInLastRow.body).toEqual('body successful');
    expect(recordInLastRow.recommend).toBeDefined();
    expect(recordInLastRow.date).toBeDefined();
    expect(recordInLastRow.response).toBeDefined();
    expect(recordInLastRow.reviewer_name).toEqual('tester1');
    expect(recordInLastRow.reviewer_email).toEqual('tester1@jest.com');
    expect(recordInLastRow.helpfulness).toBeDefined();
    expect(recordInLastRow.photos).toBeDefined();
  });

  it('should persist metadata into the characteristic reviews table for that product if request was successful', async () => {
    const { rows } = await sql.query(`SELECT review_id
      FROM characteristic_reviews
      WHERE review_id = ${reviewIdInLastRowAfterPost};`);

    expect(rows.length).toEqual(4);
  });

  it('should not insert into review_photos table if review does not have photos', async () => {
    const { rows } = await sql.query(`SELECT CASE
      WHEN EXISTS (SELECT review_id FROM reviews_photos WHERE review_id = ${reviewIdInLastRowAfterPost})
        THEN true
        ELSE false
      END;`);

    const photoCreated = rows[0].case;

    expect(photoCreated).toEqual(false);
  });
});

// TEST FOR POST: ADD A REVIEW WITH PHOTOS
describe('POST - Add a Review with photos', () => {
  let lastRowBeforePost;
  let lastRowAfterPost;

  beforeAll(async () => {
    const { rows } = await sql.query(getRow);
    lastRowBeforePost = rows[0].case;

    await request(app)
      .post('/reviews/')
      .send(newPostWithPhotos)
      .expect(201);
  });

  it('should post a new review to the last row in the reviews table', async () => {
    const { rows: newRows } = await sql.query(getRow);
    lastRowAfterPost = newRows[0].case;

    expect(lastRowBeforePost + 1).toEqual(lastRowAfterPost);
  });

  it('should not insert into review_photos table if review does not have photos', async () => {
    const { rows } = await sql.query(`SELECT CASE
      WHEN EXISTS (SELECT review_id FROM reviews_photos WHERE review_id = ${lastRowAfterPost})
        THEN true
        ELSE false
      END;`);

    const photoCreated = rows[0].case;

    expect(photoCreated).toEqual(true);
  });
});

// TEST FOR ERROR RESPONSES
describe('POST - Add a Review with invalid data', () => {
  it('should respond with status code 500 when the request is invalid', async () => {
    const res = await request(app)
      .post('/reviews/')
      .send('anything')
      .expect(500);

    expect(res.status).toEqual(500);
    expect(res.statusCode).toBe(500);
  });
});
