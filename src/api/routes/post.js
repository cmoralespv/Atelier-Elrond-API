const express = require('express');
const sql = require('../../config/db_config');

const router = express.Router();

// ROUTE FOR: ADD A REVIEW

router.post('/reviews/', (req, res) => {
  const product_id = req.body.product_id;
  const rating = req.body.rating;
  const summary = req.body.summary.toString();
  const body = req.body.body;
  const recommend = req.body.recommend;
  const reviewer_name = req.body.name;
  const reviewer_email = req.body.email;
  const photos = [];
  req.body.photos.forEach((photo) => {
    photos.push(`'${photo}'`);
  });
  const characteristics = JSON.stringify(req.body.characteristics);

  sql.query(
    `WITH review AS (
      INSERT INTO reviews
        (product_id , rating , summary, body, recommend, reviewer_name, reviewer_email)
      VALUES
        (${product_id}, ${rating}, '${summary}', '${body}', '${recommend}', '${reviewer_name}', '${reviewer_email}')
      RETURNING review_id),
    photos AS (
      INSERT INTO reviews_photos
        (review_id, url)
      SELECT review_id, url
      FROM review
      CROSS JOIN UNNEST (ARRAY [${photos}]::VARCHAR[]) AS t (url)
      RETURNING id)
    INSERT INTO characteristic_reviews
      (review_id, characteristic_id, value)
        SELECT review_id, characteristic_id, value
        FROM review
        CROSS JOIN (SELECT
          json_data.key::integer AS characteristic_id,
          json_data.value::text::smallint AS value
          FROM json_each('${characteristics}') AS json_data) as t;`)
    .then(data => res.sendStatus(201))
    .catch(e => console.error(e.stack));
});

module.exports = router;

// const data = {
//   rating, summary, body, photos: images, name: nickName,
//   email, recommend, product_id: productId, characteristics
// }

// {"rating":5,"summary":"Kinda dig it","body":"This is what you make me do more than 100 times a day","photos":["blob:http://127.0.0.1:3000/72cdcbad-9f05-4c3b-8310-7fd86189f7c4"],"name":"goat","email":"goat@goat.com","recommend":true,"product_id":40344,"characteristics":{"135219":1,"135220":1,"135221":1,"135222":1}}

// Promise.all(photos.map(photo => sql.query('insert into answers_photos values $1 returning id').then(ids => ...)
// Promise.all(photos.map(photo => sql.query('insert into answers_photos values $1 returning id', [phpto]).then(ids => ...).
// photos: string[]
// Promise[]
// const promises = photos.map(photo => sql.query('INSERT INTO answers_photos VALUES $1 returning id', [photo]);
// Joshua Booth to Everyone (6:34 PM)
// Promise.all(promises).then(ids => ...)
