const pool = require('../db');
const bcrypt = require('bcrypt');
const saltRounds = 10;




const getOneDr = async (req, res, next) => {
    console.log('Get One Dr  ');
    const {code}=req.params;
    const dr = await pool.query("SELECT nom,email, directeur, adresse,num_tel,code,compagnie,creation_date,created_by FROM  dr where code=$1",[code]);
    console.log('dr  ' + dr.rows[0]);
    if (dr.rows.length == 0) {
        res.status(404).json({
            status: "4004",
            status_message: "no data",
            result: "no dr"
        });
    } else {
        res.status(200).json({
            status: "2000",
            status_message: "Dr ",
            result: dr.rows[0]
        });
    }
}
const getAllDrs = async (req, res, next) => {
    console.log('Get ALL DRs  ');
    const drs = await pool.query("SELECT nom,email, directeur, adresse,num_tel,code,compagnie,creation_date,created_by FROM  dr");
    console.log('dr  ' + drs.rows[0]);
    if (drs.rows.length == 0) {
        res.status(404).json({
            status: "4004",
            status_message: "no data",
            result: "pas de dr"
        });
    } else {
        res.status(200).json({
            status: "2000",
            status_message: "liste des DRs",
            result: drs.rows
        });
    }

}
const createDr = async (req, res, next) => {
    const {nom, email, directeur, adresse, num_tel, code, compagnie, creation_date, created_by } = req.body;
    const hashedPwd = await bcrypt.hash("123456", saltRounds);
    const drPool=await pool.connect();
    try {
        await drPool.query('BEGIN');
        await drPool.query("INSERT INTO dr (nom,email, directeur, adresse,num_tel,code,compagnie,creation_date,created_by,password) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)", 
                        [nom,email, directeur, adresse, num_tel, code, compagnie, creation_date, created_by, hashedPwd]);
        await drPool.query('COMMIT');
            
            res.status(201).send({
            status:"2001",
            status_message:"success ",
            result:"DR ajouter avec success"
        });

    } catch (err) {
        await drPool.query('ROLLBACK');
        res.status(400).json({
            status:"4004",
            status_message:"bad request ",
            result:err.detail
        });
        console.log(err);
    }finally{
        drPool.release();
    }

}

const deleteDr = async (req, res, next) => {


}
const updateDr = async (req, res, next) => {
    const query = '';
    const { nom, prenom, email, adresse } = req.body;
    try {
        await pool.query("INSERT INTO conducteur (nom,prenom,email,adresse) VALUES ($1,$2,$3,$4)", [nom, prenom, email, adresse]);
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
