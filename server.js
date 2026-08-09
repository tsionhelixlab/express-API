
const express = require('express');
const app = express();
 const users =[];
const port = 3000;
app.use(express.json());

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

app.post('/register',(req, res)=>{
       const {name , email} = req.body;
   
    if (!name || !email){
 return res.status(400).json({error:'username and emaile are required'});
    }
   
      const user = {name, email}; 
        users.push(user);
    res.status(201).json({
        message:'sucessfully account created'
        
    });
    res.json({user:user});
     
});

app.get('/users',(req,res)=>{

    res.json(users);
});
app.listen(port,() =>{
    console.log('starting running on localhost:3000');
});