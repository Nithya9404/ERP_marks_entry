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

app.listen(port,()=>{
    console.log(`Server is running on ${port}`)
});
