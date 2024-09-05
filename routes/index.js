require('dotenv').config();
var express = require('express'); 
var router = express.Router();
const app= express();
const pool = require('../db');
const port = 1337;
const fetch = require('node-fetch');
const jwt =require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;




const posts =[
 {
  username: 'toto',
  post : 'hello mate'
 },
{
  username : 'koko',
  post : 'hi there'
}
]
//***************************************************** */

router.post('/posts',authenticateToken,function(req,res,next){

res.json(posts.filter(post => post.username === req.user.username))

});




router.post('/getToken' ,function(req,res,next){
const user= {
  username : 'toto',
}
const accessToken = generateToken(user);
const RefreshToken = jwt.sign(user,process.env.REFRESH_TOKEN_SECRET,{expiresIn : '1d'});
res.json({ acessToken : accessToken,
            RefreshToken });
});



function authenticateToken(req,res,next){
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if(token ==null){
    return res.sendStatus(401);
  }
  jwt.verify(token,process.env.ACESS_TOKEN_SECRET,(err,user) =>{
    if(err){
     return res.sendStatus(403);   
    }
    req.user =user ;
    next(); 
  });

}


function generateToken(user){
  return jwt.sign(user , process.env.ACESS_TOKEN_SECRET,{expiresIn : '15s'});
}

//***************************************************** */


router.get('/test',function(req,res,next){
  res.render('json',{layout:false});
});


router.post('/test',function(req,res,next){
  console.log("test post route");
  const {fname,lname,matricule} = req.body;
 let todo = {
  tshirt : fname+'',
  size:lname+'',
  logo:matricule+''
 };
 console.log(todo);
  let url='http://localhost:8080/tshirt';
  fetch(url, {
    method : 'post',
    body: JSON.stringify(todo),
    headers:{'Content-Type': 'application/json'}
  }).then((res) => {
    console.log('ress '+res);
    res.json().then((res1) => {
      console.log(res1);
    });
  });


  //res.status(200).send({
    //tshirt : fname+'',
    //size:lname+'',
    //logo:matricule+''
  //}); 
});


router.get('/tshirt', function(req, res, next) {
  res.status(404).send({
    tshirt:'large',
    size: 'L'
  });
});



router.get('/', function(req, res, next) {
  res.status(200).send({
    tshirt:'large',
    size: 'L'
  });
});



router.post('/tshirt',function(req,res,next){
//const {id} =req.params;
const {logo}=req.body;
if(!logo){
  res.status(404).send({message : 'we need a logo'});
}

res.status(200).send({
  tshirt: 'with your  '+logo+' and your id is '
});
});


router.get('/data',async function(req,res,next){
  const {name,location} = req.body;
  try{
   const data= await pool.query('SELECT * FROM  schools');
    res.status(200).send({
        children :"successfully got",
        data : data
      });
      console.log(data.rows[0]);

  }catch(err){
    console.log(err);
    res.sendStatus(500);
  }
  

});


router.get('/add',async function(req,res,next){
  console.log("tessttt");
 // const {name,location} = req.body;
  try{
   await pool.query('INSERT INTO schools(name , address) VALUES ($1,$2)',["name","location"]);
    res.status(200).send({message :"successfully added"});
  }catch(err){
    console.log(err);
    res.sendStatus(500);
  }
});

router.get('/setup',async function(req,res,next){
try{
    await pool.query('CREATE TABLE schools(id SERIAL PRIMARY KEY, name VARCHAR(100), address VARCHAR(100))');
}catch(err){
  console.log(err);
  res.sendStatus(500);
}
});





module.exports = router;
