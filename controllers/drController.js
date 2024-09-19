const pool = require('../db');
const bcrypt = require('bcrypt');
const saltRounds = 10;




const getOneDr = async (req, res, next) => {
    console.log('Get One Dr  ');
    const {code}=req.params;
    const dr = await pool.query("SELECT email, directeur, address,num_tel,code,compagnie,creation_date,created_by FROM  dr where code='"+code+"'");
    console.log('dr  ' + dr.rows[0]);
    if (dr.rows.length == 0) {
        res.status(201).json({
            status: "404",
            status_message: "no data",
            result: "no dr"
        });
    } else {
        res.status(201).json({
            status: "200",
            status_message: "success",
            result: dr.rows[0]
        });
    }
}

const getAllDrs = async (req, res, next) => {
    console.log('Get ALL DRs  ');
    const drs = await pool.query("SELECT email, directeur, address,num_tel,code,compagnie,creation_date,created_by FROM  dr");
    console.log('dr  ' + drs.rows[0]);
    if (dr.rows.length == 0) {
        res.status(201).json({
            status: "404",
            status_message: "no data",
            result: "no dr"
        });
    } else {
        res.status(201).json({
            status: "200",
            status_message: "success",
            result: drs.rows
        });
    }

}
const createDr = async (req, res, next) => {
    const { email, directeur, address, num_tel, code, compagnie, creation_date, created_by } = req.body;
    const hashedPwd = await bcrypt.hash("123456", saltRounds);
    try {

        await pool.query("INSERT INTO dr (email, directeur, address,num_tel,code,compagnie,creation_date,created_by,password) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)", [email, directeur, address, num_tel, code, compagnie, email, directeur, address, num_tel, code, compagnie, creation_date, created_by, hashedPwd]);
        res.status(200).send({
            message: 'conducteur ajouter avec sucess'
        });

    } catch (err) {
        res.status(404).json({
            status:"404",
            status_message:"un problem ",
            result:err.detail
        });
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
    getOneDr,
    createDr,
    deleteDr,
    updateDr,
}
