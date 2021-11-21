const sql = require('../../config/db_config');

const getReviews = (data) => {
  const promises = data.rows.map(row =>
    sql.query(
      `SELECT id, url
          FROM reviews_photos
          WHERE review_id = ${row.review_id};`)
      .then(data => {
        row.photos = data.rows;
        return row;
      })
  );

  return Promise.all(promises);
};

module.exports = {
  getReviews
};
