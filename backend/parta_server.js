const express = require('express');
const bodyParser = require('body-parser');
const { Client } = require('pg');
const format = require('pg-format');
const cors = require('cors');

const app = express();
const port = 3000;

// Enable CORS for your Angular app (assuming it's running on a different port or domain)
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
  try {
    const data = req.body;
    const values = data.map((item) => item.q);
    const formattedValues = values.map((q) => q);

    const query = format(
      'INSERT INTO parta (q1, q2, q3, q4, q5, q6, q7, q8, q9, q10) VALUES %L',
      formattedValues
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
  } catch (error) {
    console.error('Error processing data:', error);
    res.status(400).json({ error: 'Bad Request' });
  }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
