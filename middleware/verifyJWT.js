const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.sendStatus(401).json({
                    status:"4001",
                    status_message:"Unauthorized",
                    result:"Token expiré"
    });
    console.log("autheader "+authHeader); // Bearer token
    const token = authHeader.split(' ')[1];
    console.log("the token     :"+token);
    jwt.verify(
        token,
        process.env.ACESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) 
            {
                console.log("invalid token : "+err);
                return res.status(401).json({
                    status:"4001",
                    status_message:"Unauthorized",
                    result:"Token expiré"
                }); //invalid token
            }
                
            req.email = decoded.email;
            
            next();
        }
    );
}

module.exports = verifyJWT
