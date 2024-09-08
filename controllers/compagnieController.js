const pool = require('../db');



const getAllCompanies  = async (req , res ,next) => {

const companies = await pool.query("SELECT * FROM  compagnie");
console.log(''+ companies.rows[0]);
res.status(201).send("hello");



}



module.exports  =   {
    getAllCompanies,
                    }
