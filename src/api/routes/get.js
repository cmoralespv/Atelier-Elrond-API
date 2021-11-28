const express = require('express');
const sql = require('../../config/db_config');

const router = express.Router();

// Get List Reviews
router.get('/reviews/', (req, res) => {
  const product_id = req.query.product_id;
  const page = req.query.page || 1;
  const count = req.query.count || 5;
  const sortOption = req.query.sort || 'relevant';
  let sort = '';

  const sortList = (option) => {
    if (option === 'newest') {
      sort = 'date DESC';
    } else if (option === 'helpful') {
      sort = 'helpfulness DESC';
    } else {
      sort = 'helpfulness DESC, date DESC';
    }
  };

  sortList(sortOption);

  sql.query(
    `SELECT review_id, rating, summary, recommend, response,
     body, date, reviewer_name, helpfulness,
       (SELECT coalesce (json_agg(json_build_object('id',id,'url',url)), '[]'::json)
         from reviews_photos
         where review_id = reviews.review_id) as photos
      FROM reviews
      WHERE product_id = ${product_id} AND reported = FALSE
      ORDER BY ${sort}
      LIMIT ${count}
      OFFSET ${(page - 1) * count};`)

    // `SELECT review_id, rating, summary, recommend, response, body, date, reviewer_name, helpfulness
    //   FROM reviews
    //   WHERE product_id = ${product_id} AND reported = FALSE
    //   ORDER BY ${sort}
    //   LIMIT ${count}
    //   OFFSET ${(page - 1) * count};`)
    // .then(data => getReviews(data))
    .then(results => results.rows)
    .then(results => res.send({
      product_id,
      page, // :(page - 1) * count, - heroku version that doesn't make sense
      count,
      results
    }))
    .catch(e => res.sendStatus(404));
});

// Get Review Metadata
router.get('/reviews/meta', (req, res) => {
  const product_id = req.query.product_id;

  sql
    .query(`SELECT
    json_build_object('product_id', ${product_id}::text,
    'ratings', (select json_object_agg(rating, count)
      FROM (select distinct rating, count(rating)
        FROM reviews
        WHERE product_id = ${product_id}
        group by rating) AS counts),
      'recommended', (select json_build_object(
        'false', getRecommendedCount(${product_id}, false),
        'true', getRecommendedCount(${product_id}, true))),
      'characteristics', (select json_object_agg(name, json_build_object(
        'id', characteristics.id,
        'value', getAverage(id)))
          FROM characteristics
          WHERE product_id = ${product_id}))`)
    .then(results => res.send(results.rows[0].json_build_object))
    .catch(e => res.sendStatus(404));
});

module.exports = router;

// Relevance will be determined by a combination of both the date that the review was submitted as well as ‘helpfulness’ feedback received.  This combination should weigh the two characteristics such that recent reviews appear near the top, but do not outweigh reviews that have been found helpful.  Similarly, reviews that have been helpful should appear near the top, but should yield to more recent reviews if they are older.
