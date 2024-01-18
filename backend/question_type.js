const express = require('express');
const cors = require('cors');
const pg = require('pg');
const bodyparser = require('body-parser');
const format = require('pg-format');


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

app.post('/api/insertCombined', async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const data = req.body;
    const commonValues = [
      data.homeData.batch,
      data.homeData.semester,
      data.homeData.courseCode[0],
      data.homeData.degreeCode[0],
      data.homeData.deptcode[0].trim(),
      data.homeData.regulation[0].trim()
    ];

    // Insert Part A and Part B data
const partAData = Array.isArray(data.questionsPartAData.questionAnswers) ? data.questionsPartAData.questionAnswers : [];
const partBData = Array.isArray(data.partBData) ? data.partBData : [];

const combinedData = partAData.map((itemA, index) => {
  const itemB = partBData[index] || { q: [] };
  const partAValues = [...commonValues, ...itemA.q];
  const partBValues = itemB.q.map(value => (value === undefined || value === null ? null : Number(value))); // Convert to number
  return [...partAValues, ...partBValues];
});

const formattedInsertQueries = combinedData.map(item => {
  const formattedValues = item.map(innerItem => {
    return innerItem === undefined || innerItem === null ? 'NULL' : typeof innerItem === 'string' ? `'${innerItem}'` : innerItem;
  });

  return `INSERT INTO question_pattern_1 (batch_no, semester, course_code, degree_code, dept_code, regulation_no, q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, q11a, q11b, q12a, q12b, q13a, q13b, q14a, q14b, q15a, q15b) VALUES (${formattedValues.join(', ')})`;
});

formattedInsertQueries.forEach(async (insertQuery, index) => {
  try {
    const result = await pool.query(insertQuery); 
    console.log(`Inserting row ${index + 1}: Success`);
    console.log(result);
  } catch (error) {
    console.error(`Inserting row ${index + 1}: Error`);
    console.error(error);
  }
});
    // Insert IAT marks
    const iatMarksQuery = format(
      'INSERT INTO iat_marks (batch_no, semester, course_code, degree_code, dept_code, regulation_no) VALUES %L',
      [commonValues]
    );
    await client.query(iatMarksQuery);
    console.log("iat query:", iatMarksQuery);

    // Insert CO Level marks
    const coLevelMarksQuery = format(
      'INSERT INTO co_level_marks (batch_no, semester, course_code, degree_code, dept_code, regulation_no) VALUES %L',
      [commonValues]
    );
    await client.query(coLevelMarksQuery);
    console.log("colevel query: ", coLevelMarksQuery);

    await client.query('COMMIT');
    console.log('Data inserted successfully into question_pattern_1, iat_marks, and co_level_marks tables');
    res.status(200).json({ message: 'Data inserted successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error inserting data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    client.release();
  }
});

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
