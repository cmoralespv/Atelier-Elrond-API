const express = require('express');
const request = require('supertest');
const get = require('./get');
// const { pid } = require('../../../.jest/configureDb');
const pid = 90;

const app = express();
app.use(get);

// GET LIST REVIEWS TESTING
describe('GET - List Reviews', () => {
  it('should respond with status code 200 if the request was successful', async () => {
    const res = await request(app)
      .get(`/reviews?product_id=${pid}`);

    expect(res.status).toEqual(200);
    expect(res.statusCode).toBe(200);
  });

  it('should respond with status code 404 when an invalid product_id was provided', async () => {
    const res = await request(app)
      .get('/reviews?product_id=wrongValue');

    expect(res.status).toEqual(404);
    expect(res.statusCode).toBe(404);
  });

  it('should respond with status code 404 when no product_id was provided', async () => {
    const res = await request(app)
      .get('/reviews');

    expect(res.status).toEqual(404);
    expect(res.statusCode).toBe(404);
  });

  it('should respond product_id, results, and default page and count values when requesting with only a product id', async () => {
    const { body } = await request(app)
      .get(`/reviews?product_id=${pid}`)
      .expect(200);

    const { product_id, results, page, count } = body;

    expect(product_id).toEqual('90');
    expect(Array.isArray(results)).toBe(true);
    expect(page).toBe(1);
    expect(count).toBe(5);
  });

  it('should respond with product_id, results, page and count values corresponding to the query parameters the request was made on', async () => {
    const { body } = await request(app)
      .get(`/reviews?product_id=${pid}&page=2&count=10&sort=helpful`)
      .expect(200);

    const { product_id, results, page, count } = body;

    expect(product_id).toEqual('90');
    expect(Array.isArray(results)).toBe(true);
    expect(Number(page)).toEqual(2);
    expect(Number(count)).toEqual(10);
  });
});

// TEST THE RESULTS IN REVIEWS
describe('GET - List Reviews ** Results*', () => {
  it('should respond with all the values in the result array for the requested product_id', async () => {
    const { body } = await request(app)
      .get(`/reviews?product_id=${pid}`);

    const { summary, body: reviewBody, recommend, date, response, reviewer_name, helpfulness, photos } = body.results[0];

    expect(summary).toEqual('Rerum alias mollitia maiores tempore provident nostrum.');
    expect(reviewBody.includes('laudantium incidunt est explicabo aut')).toEqual(true);
    expect(typeof recommend).toEqual('boolean');
    expect(date).toBeDefined();
    expect(response).toBeDefined();
    expect(typeof reviewer_name).toEqual('string');
    expect(typeof helpfulness).toEqual('number');
    expect(helpfulness).toEqual(16);
    expect(photos.length).toEqual(1);
  });

  it('should respond with valid photo data', async () => {
    const { body } = await request(app)
      .get(`/reviews?product_id=${pid}`);

    const { photos } = body.results[0];

    expect(typeof photos[0].id).toEqual('number');
    expect(photos[0].url.includes('http')).toEqual(true);
  });

  it('should respond with an empty array when there are no photos', async () => {
    const { body } = await request(app)
      .get(`/reviews?product_id=${pid}`);

    const { photos } = body.results[1];

    expect(photos.length).toEqual(0);
  });
});

// GET METADATA FOR REVIEWS TESTING
describe('GET - Metadata', () => {
  it('should respond with status code 200 if the request was successful', async () => {
    const res = await request(app)
      .get(`/reviews/meta?product_id=${pid}`);

    expect(res.status).toEqual(200);
    expect(res.statusCode).toBe(200);
  });

  it('should respond with status code 404 when an invalid product_id was provided', async () => {
    const res = await request(app)
      .get('/reviews/meta?product_id=wrongValue');

    expect(res.status).toEqual(404);
    expect(res.statusCode).toBe(404);
  });

  it('should respond with status code 404 when no product_id was provided', async () => {
    const res = await request(app)
      .get('/reviews/meta');

    expect(res.status).toEqual(404);
    expect(res.statusCode).toBe(404);
  });

  it('should respond with product_id, ratings, recommended, and characteristics when request is made to a specific product_id', async () => {
    const { body } = await request(app)
      .get(`/reviews/meta?product_id=${pid}`)
      .expect(200);

    const { product_id, ratings, recommended, characteristics } = body;

    expect(product_id).toEqual('90');
    expect(typeof ratings === 'object').toEqual(true);
    expect(typeof recommended === 'object').toEqual(true);
    expect(typeof characteristics === 'object').toEqual(true);
  });

  it('should respond with all the characteristic values that have been defined for the product_id requested and match values on database', async () => {
    const { body } = await request(app)
      .get(`/reviews/meta?product_id=${pid}`)
      .expect(200);

    const { product_id, ratings, recommended, characteristics } = body;

    expect(product_id).toEqual('90');
    expect(ratings['3']).toEqual(1);
    expect(recommended.true).toEqual(1);
    expect(recommended.false).toBeDefined();
    expect(typeof characteristics.Fit === 'object').toEqual(true);
    expect(characteristics.Fit.id).toEqual(309);
    expect(characteristics.Length.value).toEqual('2.0000000000000000');
    expect(characteristics.Comfort).toBeDefined();
    expect(characteristics.Quality.id).toBeDefined();
  });
});
