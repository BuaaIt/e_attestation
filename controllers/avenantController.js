const pool = require('../db');
const bcrypt = require('bcrypt');
const saltRounds = 10;


const getAllAvenant = async (req, res, next) => {
    console.log('Get ALL agences  ');
    const avenants = await pool.query("SELECT id,type,created_by,creation_date, description FROM  avenant");
    console.log('avenants  ' + avenants.rows[0]);
    res.status(200).json({
        status: "200",
        status_message: "all avenants",
        result: avenants.rows
    });
}

const getOneAvenant = async (req, res, next) => {
    const { num_police } = req.params;
    console.log('Get one avenant  ' + num_police);
    const avenant = await pool.query("SELECT id,type,created_by,creation_date, description FROM  avenant where police=$1",[num_police]);
    console.log('avenant  ' + avenant.rows[0]);
   if(avenant.rowCount ==0){
    res.status(404).json({
        status: "4004",
        status_message: "not found",
        result: avenant.rows
    });
   }else{  
    res.status(200).json({
        status: "2000",
        status_message: "success",
        result: avenant.rows
    });}
}
const createAvenant = async (req, res, next) => {
    const { id, type, police, created_by, creation_date, description } = req.body;
    try {
        await pool.query("INSERT INTO avenant (id,type,police,created_by,creation_date, description) VALUES ($1,$2,$3,$4,$5,$6)", [id, type, police, created_by, creation_date, description]);
        res.status(201).json({
            status: "2001",
            status_message: "avenant created successfully",
        });
    } catch (err) {
        res.status(404).json({
            status: "4004",
            status_message: "bad request ",
            result: err.detail
        });
        console.log(err);
    }
}
const deleteAvenant = async (req, res, next) => {
    const { code } = req.body;
    try {
        await pool.query("DELETE from agence (code,directeur,email,address,num_tel,dr,password) VALUES ($1,$2,$3,$4,$5,$6,$7)", [code, directeur, email, address, num_tel, dr, hashedPwd]);
        res.status(200).json({
            status: "200",
            status_message: "agence created successfully",
        });

    } catch (err) {
        console.log(err);
    }


}
const updateAvenant = async (req, res, next) => {
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
    getAllAvenant,
    getOneAvenant,
    createAvenant,
    deleteAvenant,
    updateAvenant,
}
