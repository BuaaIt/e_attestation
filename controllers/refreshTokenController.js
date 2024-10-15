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


    //const foundUser = usersDB.users.find(person => person.refreshToken === refreshToken);
    
    const foundUser = await pool.query("SELECT * FROM  compte WHERE refresh_token=$1",[refreshToken]);
    console.log('found user : ' + foundUser.rows[0])
    if (!foundUser) return res.status(401).json({
        status:"4001",
        status_message:"unauthorized",
        result:"please refresh your token",
    }); //unauthorized
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
            res.status(200).json({ 
                        status:"2000",
                        status_message:"Acess token successfully refreshed ",
                        result:accessToken })
        }
    );
}
module.exports = { handleRefreshToken }