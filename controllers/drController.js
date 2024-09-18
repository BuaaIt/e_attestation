const pool = require('../db');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const getAllDrs = async (req, res, next) => {
    console.log('Get ALL conducteurs  ');
    const drs = await pool.query("SELECT * FROM  dr");
    console.log('dr  ' + drs.rows[0]);
    res.status(201).send(drs.rows);
}
const createDr = async (req, res, next) => {
    const {email, directeur, address,num_tel,code,compagnie} = req.body;
    const hashedPwd = await bcrypt.hash("123456", saltRounds);
    try {
        
        await pool.query("INSERT INTO dr (email, directeur, address,num_tel,code,compagnie,password) VALUES ($1,$2,$3,$4,$5,$6,$7)", [email, directeur, address,num_tel,code,compagnie,hashedPwd]);
        res.status(200).send({
            message: 'conducteur ajouter avec sucess'
        });
     
    } catch (err) {
        console.log(err);
    }

}

const deleteDr = async (req, res, next) => {


}
const updateDr = async (req, res, next) => {
    const query = '';
    const { nom, prenom, email, address } = req.body;
    try {
        await pool.query("INSERT INTO conducteur (nom,prenom,email,address) VALUES ($1,$2,$3,$4)", [nom, prenom, email, address]);
        res.status(200).send({
            message: 'conducteur ajouter avec sucess'
        })
    } catch (err) {
        console.log(err);
    }
}
module.exports = {
    getAllDrs,
    createDr,
    deleteDr,
    updateDr,
}
