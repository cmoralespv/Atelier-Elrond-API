const express = require('express');
const router = require('supertest');
const get = require('./get');

const app = express();
app.use(get);

describe('GET /reviews/', () => {
  it('responds successfully', () =>
    router(app)
      .get('/reviews?product_id=1')
      .expect(200)
  );
});
