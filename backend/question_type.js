const express = require('express');
const cors = require('cors');
const pg = require('pg');
const bodyparser = require('body-parser')

const app=express();
const port =3002;

app.use(bodyparser.json())
app.use(cors());

const pool = new pg.Pool({
    user:'postgres',
    host:'localhost',
    database:'mark_entry',
    password:'nithya9404',
    port:5432
});

app.get('/dropdown-data',(req,res) => {
    pool.query('SELECT assessment_name FROM other_assessment_master;',(error,results) => {
       if (error){
        console.error('Error fetching the data: ',error);
        res.status(500).json({error:'Internal server error'});
       }
       else{
        res.json(results.rows);
        console.log('Values',results.rows);
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
    text: 'SELECT batch_no, faculty_id1, course_code,dept_code FROM course_allocation_faculty WHERE faculty_id1 = $1',
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
      res.json({ facultyId, batch, courseCodes,deptcode });
    }
  });
});

app.get('/department/:deptcode',(req,res) => {
   const requestedDeptcode = req.params.deptcode;
   const query ={
    text: 'SELECT dept_name FROM department_master WHERE dept_code=$1',
    values:[requestedDeptcode]
   };
   pool.query(query,(err,result)=>{
      if(err){
        console.error('Error executing SQL query:',err);
        res.status(500).json({success: false,message:'Internal server error'});
      }
      else {
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

app.listen(port,()=>{
    console.log(`Server is running on ${port}`)
});
