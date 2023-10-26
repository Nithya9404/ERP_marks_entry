const express = require('express');
const bodyParser = require('body-parser');
const { Client } = require('pg');
const format = require('pg-format');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

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
  app.post('/api/insert', (req, res) => {
    // Insert data into the 'partb' table
    const data = req.body;
    const formattedData = data.map((item) => item.q);
  
    const query = format(
      'INSERT INTO question_pattern_1 (q1, q2, q3, q4, q5, q6, q7, q8, q9, q10) VALUES %L',
      formattedData
    );
  
    client.query(query)
      .then(() => {
        console.log('Data inserted successfully into partb table');
        res.status(200).json({ message: 'Data inserted successfully' });
      })
      .catch((error) => {
        console.error('Error inserting data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      });
  });

  app.post('/api/insertData', (req, res) => {
    const data = req.body;
    const { column1, column2, column3 } = data;
    console.log('Data: ', data);
  
    const query1 = {
      text: 'INSERT INTO question_pattern_1 (batch_no, semester, course_code) VALUES ($1, $2, $3)',
      values: [column1, column2, column3],
    };
  
    const query2 = {
      text: 'INSERT INTO iat_marks (batch_no, semester, course_code) VALUES ($1, $2, $3)',
      values: [column1, column2, column3],
    };

    const query3 = {
        text :'INSERT INTO co_level_marks(batch_no,semester,course_code) VALUES($1,$2,$3)',
        values: [column1,column2,column3],
    };
  
    client.query(query1)
      .then(() => {
        client.query(query2)
          .then(() => {
            client.query(query3)
              .then(() => {  
            console.log('Data inserted successfully into three tables');
            res.status(200).json({ message: 'Data inserted successfully' });
          })
        })
          .catch((error) => {
            console.error('Error inserting into iat_marks:', error);
            res.status(500).json({ error: 'Internal Server Error' });
          });
      })
      .catch((error) => {
        console.error('Error inserting into question_pattern_1:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      });
  });
  
  

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
