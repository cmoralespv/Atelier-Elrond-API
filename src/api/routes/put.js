const express = require('express');
const sql = require('../../config/db_config');

const router = express.Router();

// ROUTE FOR: MARK AS HELPFUL

router.put('/reviews/:review_id/helpful', (req, res) => {
  const review_id = req.params.review_id;

  sql.query(
    `UPDATE reviews SET helpfulness = helpfulness+1
    WHERE review_id = ${review_id};`)
    .then(data => res.sendStatus(204))
    .catch(e => console.error(e.stack));
});

// ROUTE FOR: REPORT

router.put('/reviews/:review_id/report', (req, res) => {
  const review_id = req.params.review_id;

  sql.query(
    `UPDATE reviews SET reported = NOT reported
    WHERE review_id = ${review_id};`)
    .then(data => res.sendStatus(204))
    .catch(e => console.error(e.stack));
});

module.exports = router;
