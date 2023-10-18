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

app.post('/authenticate',(req,res)=>{
    const {username,password} = req.body;
    const query={
        text:'SELECT faculty_id FROM users WHERE faculty_id=$1 AND password=$2',
        values:[username,password],
    }
    pool.query(query,(error,results)=>{
        if (error){
            console.error("Error executing the SQL query: ",error);
            res.status(500).json({success:false,message:'Internal server error'});
        }
        else if(results.rows.length > 0){
            res.json({success:true,message:'Authentication successfull'});
            console.log('Rows: ',results.rows);
        }
        else{
            res.status(401).json({success:false,message:"Invalid credentials"});
        }
    });
});

app.listen(port,()=>{
    console.log(`Server is running on ${port}`)
});
