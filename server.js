const db = require('./db');
const cors = require('cors');
const express = require('express');
const app = express();
const port = 3000;
const authRouter = require('./auth/auth');
const expenseRouter = require('./auth/expense');
app.use(cors());
app.use(express.json());
app.use('/auth',authRouter);
app.use('/auth',expenseRouter);
app.get('/',(req,res)=>{
    res.send('my first');
});
app.get('/abouts',(req,res)=>{
    res.json({
        "name":"tsion"
    });
});
app.get('/experience',(req,res)=>{
    res.json({
        "year":"2018"
    });
});
app.get('/users',(req,res)=>{

    res.json(users);
});
app.listen(port,() =>{
    console.log('starting running on localhost:3000');
});