const express = require('express');
const mysql = require('mysql');
const app = express();
const cors = require('cors');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');


function generateSHA256Hash(inputString) {
  const hash = crypto.createHash('sha256');
  hash.update(inputString);
  return hash.digest('hex');
}



app.use(express.json());
app.use(cors());

const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',        
    password : 'YOUR PASSWORD',    
    database : 'YOUR DATABASE'         
  });

  connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL Server!');
  });

module.exports = connection;

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


const candidatesRouter = require('./routes/candidates'); 
const constituenciesRouter = require('./routes/constituencies');
const partiesRouter = require('./routes/parties');
const uvc_codesRouter = require('./routes/uvc_codes');
const votersRouter = require('./routes/voters');
const electionRouter = require('./routes/election');

const ADMIN_USER_ID = 'election@shangrila.gov.sr';
const ADMIN_PASSWORD = '644c5585ece34731e5d3d43e8e0e205ad681a522c1336f2fec56def67f18dadc';
//shangrila2024$
app.use('/candidates', candidatesRouter);
app.use('/constituencies', constituenciesRouter);
app.use('/parties', partiesRouter);
app.use('/uvc_codes', uvc_codesRouter);
app.use('/voters', votersRouter);
app.use('/election', electionRouter);

app.post('/login', async (req, res) => {
    const sql = "SELECT * FROM voter WHERE voter_id = ? AND password = ?";
    const hashedPassword = generateSHA256Hash(req.body.password)

    if (req.body.email === ADMIN_USER_ID && hashedPassword === ADMIN_PASSWORD) {
      const token = jwt.sign({ userId: req.body.email, isAdmin: true }, 'yourSecretKey', {
          expiresIn: '1h',
      });
      res.json({ token, isAdmin: true });

  }else{

    connection.query(sql, [req.body.email, hashedPassword], (err, data) => {

      if(err) return res.json("Login Failed");
      if(data.length > 0) {
        const token = jwt.sign({ userId: req.body.email}, 'yourSecretKey', {
          expiresIn: '1h', 
        });
    
        res.json({ token });
      } else {
          return res.json("user not found")
      }
  })
  }


});

app.get('/gevs/constituency/:constituency', (req, res) => {
  const constituencyName = req.params.constituency.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  const query = `
    SELECT c.candidate, p.party, c.vote_count AS vote
    FROM candidate c
    JOIN party p ON c.party_id = p.party_id
    JOIN constituency ct ON c.constituency_id = ct.constituency_id
    WHERE ct.constituency_name = ?
    ORDER BY c.vote_count DESC`;

  connection.query(query, [constituencyName], (err, results) => {
    if (err) {
      res.status(500).send('Error in database operation');
    } else {
      const response = {
        constituency: req.params.constituency.toLowerCase().split('-').join(' '),
        result: results
      };
      res.json(response);
    }
  });
});

app.get('/gevs/results', (req, res) => {
  const seatsQuery = `
    SELECT p.party, COUNT(*) AS seat
    FROM candidate c
    JOIN party p ON c.party_id = p.party_id
    JOIN (
        SELECT constituency_id, MAX(vote_count) AS max_vote
        FROM candidate
        GROUP BY constituency_id
    ) AS winners ON c.constituency_id = winners.constituency_id AND c.vote_count = winners.max_vote
    GROUP BY p.party_id
    ORDER BY seat DESC`;

  connection.query(seatsQuery, (err, seatsResults) => {
    if (err) {
      res.status(500).send('Error in database operation');
    } else {
      const response = {
        status: "Completed",
        winner: seatsResults[0]?.party || 'No Winner',
        seats: seatsResults.map(row => ({
          party: row.party,
          seat: row.seat.toString()
        }))
      };
      res.json(response);
    }
  });
});






