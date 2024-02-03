const express = require('express');
const router = express.Router();
const connection = require('../server');

router.get('/', (req, res) => {
  const query = 'SELECT * FROM constituency';
  connection.query(query, (err, results) => {
      if (err) {
          res.status(500).send('Error fetching constituencies');
      } else {
          res.json(results);
      }
  });
});


module.exports = router;
