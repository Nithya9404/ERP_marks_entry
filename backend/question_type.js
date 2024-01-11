const express = require('express');
const cors = require('cors');
const pg = require('pg');
const bodyparser = require('body-parser')

const app = express();
const port = 3002;

app.use(bodyparser.json())
app.use(cors());

const pool = new pg.Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'mark_entry',
  password: 'nithya9404',
  port: 5432
});

let currentYear; 

app.get('/dropdown-data', (req, res) => {
  pool.query('SELECT assessment_name FROM other_assessment_master;', (error, results) => {
    if (error) {
      console.error('Error fetching the data: ', error);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.json(results.rows);
      console.log('Values', results.rows);
    }
  });
});

app.post('/authenticate', (req, res) => {
  const { username, password } = req.body;
  const query = {
    text: 'SELECT faculty_id FROM users WHERE faculty_id = $1 AND password = $2',
    values: [username, password],
  };
  pool.query(query, (error, results) => {
    if (error) {
      console.error('Error executing the SQL query: ', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    } else if (results.rows.length > 0) {
      const facultyId = results.rows[0].faculty_id;
      res.json({ success: true, faculty_id: facultyId, message: 'Authentication successfull' });
      console.log('Faculty ID:', facultyId);
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  });
});

app.get('/getCourseCodes/:facultyId', (req, res) => {
  const requestedFacultyId = req.params.facultyId;
  const query = {
    text: 'SELECT batch_no, faculty_id1, course_code, dept_code, degree_code,regulation_no FROM course_allocation_faculty WHERE faculty_id1 = $1',
    values: [requestedFacultyId],
  };
  pool.query(query, (err, result) => {
    if (err) {
      console.error('Error executing SQL query:', err);
      res.status(500).json({ success: false, message: 'Database error' });
    } else {
      const courseCodes = result.rows.map((row) => row.course_code);
      const batch = result.rows.map((row) => row.batch_no);
      const facultyId = result.rows.map((row) => row.faculty_id1);
      const deptcode = result.rows.map((row) => row.dept_code);
      const degreeCode = result.rows.map((row) => row.degree_code);
      const regulation = result.rows.map((row) => row.regulation_no);
      const currentYearIndex = 0;
      if (batch.length > currentYearIndex) {
        currentYear = batch[currentYearIndex];
      } else {
        currentYear = null;
      }

      res.json({ facultyId, batch, courseCodes, deptcode, degreeCode, currentYear, regulation});
    }
  });
});

app.get('/department/:deptcode', (req, res) => {
  const requestedDeptcode = req.params.deptcode;
  const query = {
    text: 'SELECT dept_name FROM department_master WHERE dept_code=$1',
    values: [requestedDeptcode]
  };
  pool.query(query, (err, result) => {
    if (err) {
      console.error('Error executing SQL query:', err);
      res.status(500).json({ success: false, message: 'Internal server error' });
    } else {
      const department = result.rows[0] ? result.rows[0].dept_name : null;
      res.json({ department });
    }
  });
});

app.get('/course_title/:courseCodes', (req, res) => {
  const requestCourseCodes = req.params.courseCodes.split(',');
  const query = {
    text: 'SELECT course_title FROM course_master WHERE course_code = ANY($1)',
    values: [requestCourseCodes],
  };
  pool.query(query, (error, results) => {
    if (error) {
      console.error('Error executing SQL query: ', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    } else {
      const courseData = results.rows;
      res.json(courseData);
    }
  });
});

app.get('/api/registerNumbers', async (req, res) => {
  if (!currentYear) {
    return res.status(400).send('Current year not available');
  }

  const query = 'SELECT register_number FROM register_numbers WHERE year = $1';

  try {
    const result = await pool.query(query, [currentYear]);
    const registerNumbers = result.rows.map((row) => row.register_number);
    res.json(registerNumbers);
  } catch (error) {
    console.error('Error querying database:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/api/insert', async (req, res) => {
  try {
    // Insert data into the 'partb' table
    const data = req.body;
    const formattedData = data.map((item) => item.q);

    const query = format(
      'INSERT INTO question_pattern_1 (q1, q2, q3, q4, q5, q6, q7, q8, q9, q10) VALUES %L',
      formattedData
    );

    await pool.query(query);
    console.log('Data inserted successfully into partb table');
    res.status(200).json({ message: 'Data inserted successfully' });
  } catch (error) {
    console.error('Error inserting data into partb table:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/insertData', async (req, res) => {
  try {
    const registerNumbersResponse = await fetch('http://localhost:3002/api/registerNumbers');
    const registerNumbers = await registerNumbersResponse.json();
    for (const registerNumber of registerNumbers) {
      const data = req.body;
      const { column1, column2, column3, column4,column6,column7 } = data;
      console.log('Data: ', data);
      const query1 = {
        text: 'INSERT INTO question_pattern_1 (batch_no, semester, course_code, degree_code, reg_no,dept_code,regulation_no) VALUES ($1, $2, $3, $4, $5,$6,$7)',
        values: [column1, column2, column3, column4[0], registerNumber,column6[0],column7[0]],
      };
      const query2 = {
        text: 'INSERT INTO iat_marks (batch_no, semester, course_code, degree_code, reg_no,dept_code,regulation_no) VALUES ($1, $2, $3, $4, $5,$6,$7)',
        values: [column1, column2, column3, column4[0], registerNumber,column6[0],column7[0]],
      };
      const query3 = {
        text: 'INSERT INTO co_level_marks (batch_no, semester, course_code, degree_code, reg_no,dept_code,regulation_no) VALUES ($1, $2, $3, $4, $5,$6,$7)',
        values: [column1, column2, column3, column4[0], registerNumber,column6[0],column7[0]],
      };
      await Promise.all([
        pool.query(query1),
        pool.query(query2),
        pool.query(query3),
      ]);
    }
    console.log('Data inserted successfully into three tables');
    res.status(200).json({ message: 'Data inserted successfully' });
  } catch (error) {
    console.error('Error inserting data into tables:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
