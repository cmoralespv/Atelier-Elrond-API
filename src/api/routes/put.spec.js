const compression = require('compression');
const express = require('express');
const request = require('supertest');
const sql = require('../../config/db_config');
const put = require('./put');
const get = require('./get');
const { newPost } = require('../../../.jest/testingData');

const app = express();
app.use(compression());
app.use(express.json());

app.use(put);
app.use(get);

// TEST FOR PUT: UPDATES HELPFULNESS COUNT
describe('PUT - Updates helpfulness count on click', () => {
  let helpfulCountBeforePut;
  let helpfulCountAfterPut;
  let randomlyChosenReview;
  let evaluationIndex;

  beforeAll(async () => {
    const { body } = await request(app)
      .get(`/reviews?product_id=${newPost.product_id}&count=10`)
      .expect(200);

    const setOfReviews = body.results.map(review => review.review_id);
    const helpfulnessOfReviews = body.results.map(review => review.helpfulness);

    (() => {
      evaluationIndex = Math.floor(Math.random() * (setOfReviews.length - 1));
      randomlyChosenReview = setOfReviews[evaluationIndex];
      helpfulCountBeforePut = helpfulnessOfReviews[evaluationIndex];
    })();

    const res = await request(app)
      .put(`/reviews/${randomlyChosenReview}/helpful`)
      .expect(204);

    expect(res.status).toEqual(204);
    expect(res.statusCode).toBe(204);
  });

  it('should update the helpful count by one', async () => {
    const { rows } = await sql.query(`SELECT helpfulness FROM reviews WHERE review_id = ${randomlyChosenReview};`);
    helpfulCountAfterPut = rows[0].helpfulness;

    expect(helpfulCountBeforePut + 1).toEqual(helpfulCountAfterPut);
  });
});

// TEST FOR PUT: FLAGS A REVIEW AS REPORTED
describe('PUT - Flags a review as reported on click', () => {
  let reportedStatusBeforePut;
  let reportedStatusAfterPut;
  let randomlyChosenReview;
  let evaluationIndex;

  beforeAll(async () => {
    const { body } = await request(app)
      .get(`/reviews?product_id=${newPost.product_id}&count=10`)
      .expect(200);

    const setOfReviews = body.results.map(review => review.review_id);

    (() => {
      evaluationIndex = Math.floor(Math.random() * (setOfReviews.length - 1));
      randomlyChosenReview = setOfReviews[evaluationIndex];
    })();

    const { rows } = await sql.query(`SELECT reported FROM reviews WHERE review_id = ${randomlyChosenReview};`);

    reportedStatusBeforePut = rows[0].reported;

    const res = await request(app)
      .put(`/reviews/${randomlyChosenReview}/report`)
      .expect(204);

    expect(res.status).toEqual(204);
    expect(res.statusCode).toBe(204);
  });

  it('should flag a review as reported and no longer post on request', async () => {
    const { rows } = await sql.query(`SELECT reported FROM reviews WHERE review_id = ${randomlyChosenReview};`);

    reportedStatusAfterPut = rows[0].reported;

    expect(reportedStatusBeforePut).toEqual(false);
    expect(reportedStatusAfterPut).toEqual(true);
  });

  it('should not be posted on request', async () => {
    jest.setTimeout(20000); // Not working and cant find a solution
    const { body } = await request(app)
      // increase count when timeout works
      .get(`/reviews?product_id=${newPost.product_id}&count=10`)
      .expect(200);

    const matchingReviews = body.results.filter(review =>
      review.review_id === randomlyChosenReview);

    expect(matchingReviews.length).toEqual(0);
  });
});
