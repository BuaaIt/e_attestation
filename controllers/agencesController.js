const pool = require('../db');
const bcrypt = require('bcrypt');
const saltRounds = 10;


const getAllAgencies = async (req, res, next) => {
    console.log('Get ALL agences  ');
    const agences = await pool.query("SELECT nom,code,directeur,email,address,num_tel,dr,creation_date ,created_by FROM  agence");
    console.log('agences  ' + agences.rows[0]);
    if (agences.rowCount == 0) {
        res.status(201).json({
            status: "4004",
            status_message: "No agence found",
            result: agences.rows
        });
    } else {
        res.status(200).json({
            status: "2000",
            status_message: "success",
            result: agences.rows
        });
    }
}

const getOneAgence = async (req, res, next) => {
    const { code } = req.params;
    console.log('Get one agence  ' + code);
    const agences = await pool.query("SELECT nom,code,directeur,email,address,num_tel,dr,creation_date ,created_by FROM  agence where code=$1", [code]);
    console.log('agences  ' + agences.rows[0]);
    if (agences.rowCount == 0) {
        res.status(404).json({
            status: "4004",
            status_message: "Agence not found",
            result: agences.rows[0]
        });
    } else {
        res.status(201).json({
            status: "2000",
            status_message: "success",
            result: agences.rows[0]
        });
    }

}
const createAgencie = async (req, res, next) => {
    const { nom, code, directeur, email, address, num_tel, dr, creation_date, created_by } = req.body;
    const agence = await pool.connect();
    try {
        const hashedPwd = await bcrypt.hash("123456", saltRounds);
        await agence.query('BEGIN');
        await agence.query("INSERT INTO agence (nom,code,directeur,email,address,num_tel,dr,creation_date,created_by ,password) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)",
            [nom, code, directeur, email, address, num_tel, dr, creation_date, created_by, hashedPwd]);
        await agence.query("INSERT INTO compte (username,code_structure,password,role,creation_date,created_by) VALUES ($1,$2,$3,$4,$5,$6)",
            [email, code, hashedPwd, 'agence', creation_date, created_by]);
        await agence.query('COMMIT');

        res.status(200).json({
            status: "2001",
            status_message: "success ",
            result: "Agence ajouter avec success"
        });
    } catch (err) {
        await agence.query('ROLLBACK');
        res.status(400).json({
            status: "4000",
            status_message: "Bas request ",
            result: err.detail
        });
        console.log(err);
    } finally {
        agence.release();
    }

}

const deleteAgencie = async (req, res, next) => {

    const { code } = req.body;
    try {
        await pool.query("DELETE from agence (code,directeur,email,address,num_tel,dr,password) VALUES ($1,$2,$3,$4,$5,$6,$7)", [code, directeur, email, address, num_tel, dr, hashedPwd]);
        res.status(200).json({
            status: "2001",
            status_message: "success ",
            result: "Agence ajouter avec success"
        });

    } catch (err) {
        res.status(400).json({
            status: "4000",
            status_message: "bad request",
            result: err.detail

        })
        console.log(err);
    }
}
const updateAgencie = async (req, res, next) => {
    const query = '';
    const { nom, prenom, email, address } = req.body;
    try {
        await pool.query("INSERT INTO agence (nom,prenom,email,address) VALUES ($1,$2,$3,$4)", [nom, prenom, email, address]);
        res.status(201).send({
            status: "2001",
            status_message: 'compagnie created successfully'
        })
    } catch (err) {
        res.status(400).send({
            status: "4000",
            status_message: 'Bad request',
            result: err.detail
        })
        console.log(err);
    }
}
module.exports = {
    getAllAgencies,
    getOneAgence,
    createAgencie,
    deleteAgencie,
    updateAgencie,
}
