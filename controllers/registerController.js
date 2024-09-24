//const usersDB = {
//    users: require('../model/users'),
//    setUsers: function (data) { this.users = data }
//}
const pool = require('../db');
const path = require('path');
const bcrypt = require('bcrypt');
const fsPromises = require('fs').promises;
const saltRounds = 10;

const register= async (req, res) =>{
    const { fname, lname, email, password1, password2 } = req.body;
    let errors = [];
    if (!fname || !lname || !email  || !password1 || !password2 ) {
      errors.push({ msg: 'please fill in all fields' });
    }
    // check passwords match 
  
    if (password1 != password2) {
      errors.push({ msg: 'passwords do not match' });
    }
    //check the password length 
    if (password1.length < 6) {
      errors.push({ msg: 'password at least 6 characters' });
    }
        
        const hashedPwd = await bcrypt.hash(password1, saltRounds);
            try{
              await pool.query('INSERT INTO users(fname , lname,email,password) VALUES ($1,$2,$3,$4)',[fname,lname,email,hashedPwd]);
               res.status(201).send({
                status:"2001",
                status_message:"",
                message :"successfully added"});
             }catch(err){
               console.log(err);
               res.status(400).json({
                status:"4000",
                status_message:"Bad request",
                result:err.detail,
               });
             }

        res.status(200).send("user added succesfully");
        // Store hash in your password DB.
    
    //  res.render('register',{layout:false});
  };

  module.exports = { register };
  
  