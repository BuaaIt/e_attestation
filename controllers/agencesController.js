const pool = require('../db');
const bcrypt = require('bcrypt');
const saltRounds = 10;


const getAllAgencies = async (req, res, next) => {
    console.log('Get ALL agences  ');
    const agences = await pool.query("SELECT * FROM  agence");
    console.log('agences  ' + agences.rows[0]);
    res.status(201).send(agences.rows);
}
const createAgencie = async (req, res, next) => {
    const {code, directeur, email,address, num_tel, dr,creation_date,created_by } = req.body;
    try {
        const hashedPwd = await bcrypt.hash("123456", saltRounds);    
        await pool.query("INSERT INTO agence (code,directeur,email,address,num_tel,dr,creation_date,created_by ,password) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) on conflict (code) do nothing;", [code, directeur, email, address,num_tel,dr,creation_date,created_by ,hashedPwd]);
        res.status(200).send({
            message: 'agence ajouter avec sucess'
        });
     
    } catch (err) {
        console.log(err);
    }

}

const deleteAgencie = async (req, res, next) => {

    const {code} = req.body;
    try {    
        await pool.query("DELETE from agence (code,directeur,email,address,num_tel,dr,password) VALUES ($1,$2,$3,$4,$5,$6,$7)", [code, directeur, email, address,num_tel,dr,hashedPwd]);
        res.status(200).send({
            message: 'agence deleted avec sucess'
        });
     
    } catch (err) {
        console.log(err);
    }


}
const updateAgencie = async (req, res, next) => {
    const query = '';
    const { nom, prenom, email, address } = req.body;
    try {
        await pool.query("INSERT INTO compagnie (nom,prenom,email,address) VALUES ($1,$2,$3,$4)", [nom, prenom, email, address]);
        res.status(200).send({
            message: 'compagnie ajouter avec sucess'
        })
    } catch (err) {
        console.log(err);
    }
}
module.exports = {
    getAllAgencies,
    createAgencie,
    deleteAgencie,
    updateAgencie,
}
