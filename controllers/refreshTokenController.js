const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (data) { this.users = data }
}
const pool = require('../db');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const handleRefreshToken = async (req, res) => {
    
    const cookies = req.cookies;
    console.log("cookiie "+JSON.stringify (req.cookies));
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;
    console.log('refresh ' + refreshToken);


    //    const foundUser = usersDB.users.find(person => person.refreshToken === refreshToken);

    const foundUser = await pool.query("SELECT * FROM  users WHERE refresh_token='" + refreshToken + "'");
    console.log('found user : ' + foundUser.rows[0])

    if (!foundUser) return res.sendStatus(403); //Forbidden 
    // evaluate jwt 
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || foundUser.rows[0].email !== decoded.email) return res.sendStatus(403);
            console.log("decoded " + decoded.email);
            const accessToken = jwt.sign(
                { "email": decoded.email },
                process.env.ACESS_TOKEN_SECRET,
                { expiresIn: '10m' }
            );
            res.json({ "status":"200",
                        "status_message":"Acess token successfully refreshed ",
                accessToken })
        }
    );
}
module.exports = { handleRefreshToken }