const express = require('express');
const bodyParser = require('body-parser');
const { Client } = require('pg');
const format = require('pg-format');
const cors = require('cors');

const app = express();
const port = 4000;

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
    'INSERT INTO partb (q11a, q11b, q12a, q12b, q13a, q13b, q14a, q14b, q15a, q15b) VALUES %L',
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
