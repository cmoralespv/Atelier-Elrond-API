const express = require('express');
const sql = require('../../config/db_config');

const router = express.Router();

router.post('/reviews/', (req, res) => {
  console.log(req.query);
  res.send('post a hello world');
});

module.exports = router;
