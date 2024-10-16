const pool = require('../db');
const bcrypt = require('bcrypt');
const saltRounds = 10;


const getAllComptes = async (req, res, next) => {
    console.log('Get ALL comptes  ');
    const comptes = await pool.query("SELECT username,code_structure,creation_date ,created_by FROM  compte");
    console.log('comtes  ' + comtes.rows[0]);
    if (comptes.rowCount == 0) {
        res.status(201).json({
            status: "4004",
            status_message: "No agence found",
            result: comptes.rows
        });
    } else {
        res.status(200).json({
            status: "2000",
            status_message: "success",
            result: comptes.rows
        });
    }
}

const getOneCompte = async (req, res, next) => {
    const { username } = req.params;
    console.log('Get one compte  ' + username);
    const comptes = await pool.query("SELECT username,code_structure,creation_date ,created_by FROM  compte where username=$1", [username]);
    console.log('compte  ' + comptes.rows[0]);
    if (comptes.rowCount == 0) {
        res.status(404).json({
            status: "4004",
            status_message: "Compte non trouve",
            result: comptes.rows[0]
        });
    } else {
        res.status(201).json({
            status: "2000",
            status_message: "success",
            result: comptes.rows[0]
        });
    }

}


const createCompte = async (req, res, next) => {
    const requests = req.body;
try{
    if (Array.isArray(requests)) {
        for (var i = 0; i < requests.length; i++) {
            await pool.query("INSERT INTO compte (username,code_structure,password,creation_date,created_by ,password) VALUES ($1,$2,$3,$4,$5,$6)",
            [requests[i].email, requests[i].code_structure,requests[i].hashedPwd, requests[i].creation_date, requests[i].created_by]);
        }
    } else {
        const { code_structure, email,creation_date, created_by} = req.body;
        await pool.query("INSERT INTO compte (username,code_structure,password,creation_date,created_by ,password) VALUES ($1,$2,$3,$4,$5,$6)",
            [email, code_structure,hashedPwd, creation_date, created_by]);
    }
}catch(err){
    res.status(400).json({
        status: "4000",
        status_message: "mauvaise requette ",
        result: err.detail
    });
}
}

const deleteCompte = async (req, res, next) => {
    const { code } = req.body;
    try {
        await pool.query("DELETE from agence (code,directeur,email,adresse,num_tel,dr,password) VALUES ($1,$2,$3,$4,$5,$6,$7)", [code, directeur, email, adresse, num_tel, dr, hashedPwd]);
        res.status(200).json({
            status: "2001",
            status_message: "success ",
            result: "compte ajouter avec success"
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
const updateCompte = async (req, res, next) => {
    const query = '';
    const { nom, prenom, email, adresse } = req.body;
    try {
        await pool.query("INSERT INTO agence (nom,prenom,email,adresse) VALUES ($1,$2,$3,$4)", [nom, prenom, email, adresse]);
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
    getAllComptes,
    getOneCompte,
    createCompte,
    deleteCompte,
    updateCompte,
}
