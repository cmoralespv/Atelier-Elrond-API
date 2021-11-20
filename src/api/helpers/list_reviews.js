const sql = require('../../config/db_config');

const listReviews = async (product_id, page, count, data) => {
  const currentProduct = {};

  currentProduct.product = product_id;
  currentProduct.page = data.rowCount / count;
  currentProduct.count = data.rowCount;
  currentProduct.results = [];

  var bar = new Promise((resolve, reject) => {
    data.rows.forEach((row, index, array) => {
      sql.query(
        `SELECT id, url
            FROM reviews_photos
            WHERE review_id = ${row.review_id};`)
        .then(data => {
          row.photos = data.rows;
        })
        .then(() => {
          currentProduct.results.push(row);
        })
        .then(() => {
          //console.log('this is while iterating', currentProduct);
          if (index === array.length - 1) { resolve(); }
        })
        .catch(e => console.error(e.stack));
    });
  });

  bar.then(() => {
    console.log('this is going to fast', currentProduct);
    return currentProduct;
  });
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
