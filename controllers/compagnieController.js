const pool = require('../db');



const getAllCompanies  = (req , res ,next) => {

const companies = pool.query("SELECT * FROM  compagnie");
console.log(''+ companies);
res.status(201).send("hello");



}



module.exports  =   {
    getAllCompanies,
                    }