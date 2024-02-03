const express = require('express');
const router = express.Router();
const connection = require('../server');

let isElectionStarted = true;

router.post('/start-election', (req, res) => {
    isElectionStarted = true;
    res.json({ success: true });
  });

  router.post('/stop-election', (req, res) => {
    isElectionStarted = false;
    res.json({ success: true });
  });

  router.get('/get-election-status', (req, res) => {
    res.json({ isElectionStarted });
  });

  router.post('/update-election-status', (req, res) => {
    const { newStatus } = req.body;

    isElectionStarted = newStatus;

    res.json({ success: true, message: 'Election status updated successfully' });
});

router.get('/data', (req, res) => {
    const query = `
    SELECT
      p.party AS party_name,
      c.constituency_name,
      COUNT(*) AS won_constituencies
    FROM candidate ca
    INNER JOIN party p ON ca.party_id = p.party_id
    INNER JOIN constituency c ON ca.constituency_id = c.constituency_id
    WHERE ca.vote_count = (SELECT MAX(vote_count) FROM candidate ca2 WHERE ca2.constituency_id = ca.constituency_id)
    GROUP BY p.party, c.constituency_name
  `;

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching election data:', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.json(results);
    }
    });
  });
  
  module.exports = router;