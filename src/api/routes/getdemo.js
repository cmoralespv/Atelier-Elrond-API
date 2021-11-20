const listReviews = (product_id, page, count, data) => {
  const reviewList = [];
  let currentReview = {};

  for (const review in data) {
    if ({}.hasOwnProperty.call(data, review)) {
      currentReview = {};

      currentReview.product = product_id;
      currentReview.page = data.rowCount / count;
      currentReview.count = data.rowCount;
      currentReview.results = [];

      data.rows.forEach(review => {
        currentReview.results.push(review);
      });
      reviewList.push(currentReview);
    }
  }
  return reviewList;
};

module.exports = {
  listReviews
};



















const express = require('express');
const sql = require('../../config/db_config');
const { listReviews } = require('../helpers/list_reviews');

const router = express.Router();

productInfo.get('/products/:product_id', async (req, res) => {
  const productInfoQuery = 'SELECT id, name, slogan, description, category, default_price FROM products WHERE id = $1';
  const featuresQuery = 'SELECT feature, value FROM features WHERE product_id = $1';
  const product = await client.query(productInfoQuery, [req.params.product_id]);
  const features = await client.query(featuresQuery, [req.params.product_id]);

  const productWithFeatures = product.rows[0];
  productWithFeatures.features = features.rows;
  res.send(productWithFeatures);
});



// Get List Reviews
router.get('/reviews/', async (req, res) => {
  const product_id = req.query.product_id;
  const page = req.query.page || 1;
  const count = req.query.count || 5;
  let result;

  const reviewsListQuery = `SELECT review_id, rating, summary, recommend, response, body, date,   reviewer_name, helpfulness
    FROM reviews
    WHERE product_id = $1 AND reported = FALSE
    ORDER BY review_id ASC
    LIMIT $2
    OFFSET $3`;
  const photosQuery = `SELECT id, url
    FROM reviews_photos
    WHERE reviews.review_id = ;`;

    const reviews = await sql.query(reviewsListQuery, [product_id, count, (page - 1) * count]);
    const photos = await getPhotos = () => {
      console.log('hi');
    }
    //(let i = 0; i < reviews.length; i ++) {

    }

    sql.query(photosQuery, [count])

  sql.query(
    `SELECT review_id, rating, summary, recommend, response, body, date, reviewer_name, helpfulness
      FROM reviews
      WHERE product_id = ${product_id} AND reported = FALSE
      ORDER BY review_id ASC
      LIMIT ${count}
      OFFSET ${(page - 1) * count};`)
    .then(data => {
      result = listReviews(product_id, page, count, data);
    })
    .then(() => res.send(result))
    .then(console.log(res.statusCode))
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




const sql = require('../../config/db_config');

// const getPhotos = (review_id) => {
//   sql.query(
//     `SELECT id, url
//       FROM reviews_photos
//       WHERE review_id = ${review_id};`)
//     .then(data => {
//       currentPhotos = data.rows;
//     })
//     .catch(e => console.error(e.stack));
// };

const listReviews = (product_id, page, count, data) => {
  const reviewList = [];
  let currentReview = {};

  for (const review in data) {
    if ({}.hasOwnProperty.call(data, review)) {
      currentReview = {};

      currentReview.product = product_id;
      currentReview.page = data.rowCount / count;
      currentReview.count = data.rowCount;
      currentReview.results = [];
      currentReview.results.push(review);

      // data.rows.forEach(review => {
      //   sql.query(
      //     `SELECT id, url
      //       FROM reviews_photos
      //       WHERE review_id = ${review.review_id};`)
      //     .then(data => {
      //       //console.log(data.rows);
      //       review.photos = data.rows;
      //       console.log(review);
      //     })
      //     .then(currentReview.results.push(review))
      //     .then(reviewList.push(currentReview))
      //     .catch(e => console.error(e.stack));
      // });
    }
  }
  return reviewList;
};

module.exports = {
  listReviews
};

// {
//   "command": "SELECT",
//   "rowCount": 5,
//   "oid": null,
//   "rows": [
//       {
//           "id": 3,
//           "rating": 4,
//           "summary": "I am liking these glasses",
//           "recommend": true,
//           "response": "Glad you're enjoying the product!",
//           "body": "They are very dark.  But that's good because I'm in very sunny spots",
//           "date": "1609325851021",
//           "reviewer_name": "bigbrotherbenjamin",
//           "helpfulness": 5,
//           "reported": false
//       },
//       {
//           "id": 4,
//           "rating": 4,
//           "summary": "They look good on me",
//           "recommend": true,
//           "response": "null",
//           "body": "I so stylish and just my aesthetic.",
//           "date": "1593628485253",
//           "reviewer_name": "fashionperson",
//           "helpfulness": 1,
//           "reported": false
//       },
//       {
//           "id": 5,
//           "rating": 3,
//           "summary": "I'm enjoying wearing these shades",
//           "recommend": true,
//           "response": "null",
//           "body": "Comfortable and practical.",
//           "date": "1615987717620",
//           "reviewer_name": "shortandsweeet",
//           "helpfulness": 5,
//           "reported": false
//       },
//       {
//           "id": 6,
//           "rating": 5,
//           "summary": "I'm not a fan!",
//           "recommend": false,
//           "response": "Sorry to hear. Is there anything in particular you don't like?",
//           "body": "I don't like them",
//           "date": "1593564521722",
//           "reviewer_name": "negativity",
//           "helpfulness": 0,
//           "reported": false
//       },
//       {
//           "id": 7,
//           "rating": 2,
//           "summary": "This product was ok!",
//           "recommend": false,
//           "response": "null",
//           "body": "They're fine but I wouldn't buy again.",
//           "date": "1609522845466",
//           "reviewer_name": "anyone",
//           "helpfulness": 0,
//           "reported": false
//       }
//   ],
//   "fields": [
//       {
//           "name": "id",
//           "tableID": 16388,
//           "columnID": 1,
//           "dataTypeID": 23,
//           "dataTypeSize": 4,
//           "dataTypeModifier": -1,
//           "format": "text"
//       },
//       {
//           "name": "rating",
//           "tableID": 16388,
//           "columnID": 3,
//           "dataTypeID": 21,
//           "dataTypeSize": 2,
//           "dataTypeModifier": -1,
//           "format": "text"
//       },
//       {
//           "name": "summary",
//           "tableID": 16388,
//           "columnID": 5,
//           "dataTypeID": 25,
//           "dataTypeSize": -1,
//           "dataTypeModifier": -1,
//           "format": "text"
//       },
//       {
//           "name": "recommend",
//           "tableID": 16388,
//           "columnID": 7,
//           "dataTypeID": 16,
//           "dataTypeSize": 1,
//           "dataTypeModifier": -1,
//           "format": "text"
//       },
//       {
//           "name": "response",
//           "tableID": 16388,
//           "columnID": 11,
//           "dataTypeID": 1043,
//           "dataTypeSize": -1,
//           "dataTypeModifier": 1004,
//           "format": "text"
//       },
//       {
//           "name": "body",
//           "tableID": 16388,
//           "columnID": 6,
//           "dataTypeID": 1043,
//           "dataTypeSize": -1,
//           "dataTypeModifier": 1004,
//           "format": "text"
//       },
//       {
//           "name": "date",
//           "tableID": 16388,
//           "columnID": 4,
//           "dataTypeID": 20,
//           "dataTypeSize": 8,
//           "dataTypeModifier": -1,
//           "format": "text"
//       },
//       {
//           "name": "reviewer_name",
//           "tableID": 16388,
//           "columnID": 9,
//           "dataTypeID": 1043,
//           "dataTypeSize": -1,
//           "dataTypeModifier": 64,
//           "format": "text"
//       },
//       {
//           "name": "helpfulness",
//           "tableID": 16388,
//           "columnID": 12,
//           "dataTypeID": 23,
//           "dataTypeSize": 4,
//           "dataTypeModifier": -1,
//           "format": "text"
//       },
//       {
//           "name": "reported",
//           "tableID": 16388,
//           "columnID": 8,
//           "dataTypeID": 16,
//           "dataTypeSize": 1,
//           "dataTypeModifier": -1,
//           "format": "text"
//       }
//   ],
//   "_parsers": [
//       null,
//       null,
//       null,
//       null,
//       null,
//       null,
//       null,
//       null,
//       null,
//       null
//   ],
//   "_types": {
//       "_types": {
//           "arrayParser": {},
//           "builtins": {
//               "BOOL": 16,
//               "BYTEA": 17,
//               "CHAR": 18,
//               "INT8": 20,
//               "INT2": 21,
//               "INT4": 23,
//               "REGPROC": 24,
//               "TEXT": 25,
//               "OID": 26,
//               "TID": 27,
//               "XID": 28,
//               "CID": 29,
//               "JSON": 114,
//               "XML": 142,
//               "PG_NODE_TREE": 194,
//               "SMGR": 210,
//               "PATH": 602,
//               "POLYGON": 604,
//               "CIDR": 650,
//               "FLOAT4": 700,
//               "FLOAT8": 701,
//               "ABSTIME": 702,
//               "RELTIME": 703,
//               "TINTERVAL": 704,
//               "CIRCLE": 718,
//               "MACADDR8": 774,
//               "MONEY": 790,
//               "MACADDR": 829,
//               "INET": 869,
//               "ACLITEM": 1033,
//               "BPCHAR": 1042,
//               "VARCHAR": 1043,
//               "DATE": 1082,
//               "TIME": 1083,
//               "TIMESTAMP": 1114,
//               "TIMESTAMPTZ": 1184,
//               "INTERVAL": 1186,
//               "TIMETZ": 1266,
//               "BIT": 1560,
//               "VARBIT": 1562,
//               "NUMERIC": 1700,
//               "REFCURSOR": 1790,
//               "REGPROCEDURE": 2202,
//               "REGOPER": 2203,
//               "REGOPERATOR": 2204,
//               "REGCLASS": 2205,
//               "REGTYPE": 2206,
//               "UUID": 2950,
//               "TXID_SNAPSHOT": 2970,
//               "PG_LSN": 3220,
//               "PG_NDISTINCT": 3361,
//               "PG_DEPENDENCIES": 3402,
//               "TSVECTOR": 3614,
//               "TSQUERY": 3615,
//               "GTSVECTOR": 3642,
//               "REGCONFIG": 3734,
//               "REGDICTIONARY": 3769,
//               "JSONB": 3802,
//               "REGNAMESPACE": 4089,
//               "REGROLE": 4096
//           }
//       },
//       "text": {},
//       "binary": {}
//   },
//   "RowCtor": null,
//   "rowAsArray": false
// }
