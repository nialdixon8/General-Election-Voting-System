const express = require('express');
const router = express.Router();
const connection = require('../server');
const crypto = require('crypto');
const { authenticateJWT } = require("../authModule");


function generateSHA256Hash(inputString) {
  const hash = crypto.createHash('sha256');
  hash.update(inputString);
  return hash.digest('hex');
}


router.get('/', (req, res) => {
  connection.query('SELECT * FROM voter', (err, results, fields) => {
    if (err) throw err;
    res.json(results);
  });
});



router.get('/dashboard', authenticateJWT, (req, res) => {
  const voterId = "name"; 
  console.log(req.body);
  const query = 'SELECT * FROM voter WHERE voter_id = ?';
  connection.query(query, [voterId], (err, results) => {
      if (err) {
          res.status(500).send(err.message);
      } else {
          res.json(results);
      }
  });
});


router.post('/newUser', async (req, res) => {
  const { voter_id, full_name, DOB, password, UVC, constituency_id } = req.body;


  const hashedPassword = generateSHA256Hash(password);


  const checkUserQuery = "SELECT COUNT(voter_id) AS count FROM voter WHERE voter_id = ?";
  connection.query(checkUserQuery, [voter_id], (err, results) => {
    if (err) {
      return res.status(500).send('Error checking existing user');
    }

    if (results[0].count > 0) {
      return res.status(202).send('Email already exists');
    } 




      const uvcCheckQuery = 'SELECT COUNT(*) AS count FROM uvc_code WHERE UVC = ? AND used = 0';
      connection.query(uvcCheckQuery, [UVC], (uvcErr, uvcResults) => {
        if (uvcErr || uvcResults[0].count === 0) {
          return res.status(201).send('Invalid or already used UVC');
        }
        
        const updateUVCQuery = "UPDATE uvc_code SET used = 1 WHERE UVC = ?";
        connection.query(updateUVCQuery, [UVC], (updateErr) => {
          if (updateErr) {
            return res.status(500).send('Error updating UVC status');
          }
          
          const insertQuery = 'INSERT INTO voter (voter_id, full_name, DOB, password, UVC, constituency_id) VALUES (?, ?, ?, ?, ?, ?)';
          connection.query(insertQuery, [voter_id, full_name, DOB, hashedPassword, UVC, constituency_id], (insertErr, insertResults) => {
            if (insertErr) {
              return res.status(500).send('Error registering user');
            }
            res.status(200).send('User registered successfully');
        });
      });
    });
  });
});



module.exports = router;