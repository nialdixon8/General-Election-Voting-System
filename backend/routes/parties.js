const express = require('express');
const router = express.Router();
const connection = require('../server');

router.get('/', (req, res) => {
  connection.query('SELECT * FROM party', (err, results, fields) => {
    if (err) throw err;
    res.json(results);
  });
});


module.exports = router;
