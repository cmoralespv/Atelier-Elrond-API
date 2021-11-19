const express = require('express');
const sql = require('../../config/db_config');

const router = express.Router();

// Get List Reviews
router.get('/reviews/', (req, res) => {
  const product_id = req.query.product_id;
  const page = req.query.page || 1;
  const count = req.query.count || 5;

  sql.query(
    `SELECT id, rating, summary, recommend, response, body, date, reviewer_name, helpfulness,     reported
      FROM reviews
      WHERE product_id = ${product_id} AND reported = FALSE
      ORDER BY id ASC
      LIMIT ${count}
      OFFSET ${(page - 1) * count};`)
    .then(data => {
      res.send(data);
      console.log(res.statusCode);
    })
    .catch(e => console.error(e.stack));
  //   ,
  // (err, data) => {
  //   if (err) {
  //     console.log(err.stack);
  //   } else {
  //     console.log(data);
  //     console.log(res.statusCode);
  //   }
  // });

  // res.send('hello world');
});

// Get Review Metadata
router.get('/reviews/meta', (req, res) => {
  const product_id = req.query.product_id;

  // WORK IN PROGRESS // EXPERIMENTING WITH PROMISES
  sql
    .query(`SELECT id, rating, recommend
      FROM reviews
      WHERE product_id = ${product_id}
      ORDER BY id ASC
      LIMIT 1`)
    .then(data => {
      res.send(data);
      console.log(res.statusCode);
    })
    .catch(e => console.error(e.stack));
});

module.exports = router;

// Relevance will be determined by a combination of both the date that the review was submitted as well as ‘helpfulness’ feedback received.  This combination should weigh the two characteristics such that recent reviews appear near the top, but do not outweigh reviews that have been found helpful.  Similarly, reviews that have been helpful should appear near the top, but should yield to more recent reviews if they are older.
