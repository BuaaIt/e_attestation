//const usersDB = {
//    users: require('../model/users'),
//    setUsers: function (data) { this.users = data }
//}
const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const path = require('path');


const auth = async (req, res) => {
    console.log('test authController');
    const { email, password } = req.body;
    let errors = [];
    console.log('email ' + email + ' pass ' + password)
    if (!email || !password) {
        res.status(400).send({ msg: 'please fill in all fields' });
    } else {// lookup for an existing account

        try{
            const foundUser= await pool.query("SELECT * FROM  users WHERE email='"+email+"'");
             //res.status(200).send({
                 children :"successfully got",
                 //data : foundUser
              // });
               console.log('daaata '+foundUser.rows[0].password);
               if (!foundUser) {
                res.status(401).send({ msg: 'Password or email invalid' });
            } else {
                const match = await bcrypt.compare(password, foundUser.rows[0].password);
                if (match) {
                    console.log('match');
                    const accessToken = jwt.sign({
                        "email": foundUser.rows[0].email,
                    }, process.env.ACESS_TOKEN_SECRET, { expiresIn: '10m' }
                    );
                    const refreshToken = jwt.sign(
                        { "email": foundUser.rows[0].email },
                        process.env.REFRESH_TOKEN_SECRET,
                        { expiresIn: '1d' }
                    );
                    //store the refresh token with the current user on db
                    const updateUser= await pool.query("UPDATE users SET refresh_token='"+refreshToken+"' where email='"+email+"'");
                    

                    res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 });
                    res.json({ "status": "200",
                               "status_message": "User authenticated successfully",
                        accessToken , refreshToken});
                }else {
                    res.sendStatus(401).json({
                        "status":"401",
                        "status_message":"wrong password"
                    });
                }
               
            }
           }catch(err){
             console.log(err);
             res.sendStatus(500);
           }


     //   const foundUser = usersDB.users.find(person => person.email === email);
      
        
    }
    //Note that returned variable john here is an instance of your model,
    //so you can also do myCar.delete(), myCar.save() type operations on the instance.
    //myCar.forEach(element => {
    // console.log('Found ' + element.lastname + ' to be ' + element.age + ' years old! ' + element.id);  
    //});


}


module.exports = { auth };
