const express = require('express');
const bodyParser = require('body-parser');
const { Client } = require('pg');
const format = require('pg-format');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'mark_entry',
  password: 'nithya9404',
  port: 5432,
});

client.connect()
  .then(() => {
    console.log('Connected to PostgreSQL database');
  })
  .catch((error) => {
    console.error('Error connecting to PostgreSQL database:', error);
  });

app.use(bodyParser.json());

app.post('/api/insertData', (req, res) => {
  const data = req.body;
  const formattedData = data.map((item) => item.q);

  const query = format(
    'INSERT INTO parta (q1, q2, q3, q4, q5, q6, q7, q8, q9, q10) VALUES %L',
    formattedData
  );

  client.query(query)
    .then(() => {
      console.log('Data inserted successfully');
      res.status(200).json({ message: 'Data inserted successfully' });
    })
    .catch((error) => {
      console.error('Error inserting data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
