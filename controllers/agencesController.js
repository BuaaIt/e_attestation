const pool = require('../db');

const getAllAgencies = async (req, res, next) => {
    console.log('Get ALL agences  ');
    const agences = await pool.query("SELECT nom,code,directeur,email,adresse,num_tel,dr,creation_date ,created_by FROM  agence");
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
    const agences = await pool.query("SELECT nom,code,directeur,email,adresse,num_tel,dr,creation_date ,created_by FROM  agence where code=$1", [code]);
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
    const requests = req.body;
    try{
    if (Array.isArray(requests)) {
        for (var i = 0; i < requests.length; i++) {
            await pool.query("INSERT INTO agence (nom,code,directeur,email,adresse,num_tel,dr,creation_date,created_by) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)",
            [requests[i].nom, requests[i].code, requests[i].directeur, requests[i].email,
                requests[i].adresse, requests[i].num_tel, requests[i].dr, requests[i].creation_date,
                requests[i].created_by]);
        }
    } else {
        const { nom, code, directeur, email, adresse, num_tel, dr, creation_date, created_by } = req.body;
        await pool.query("INSERT INTO agence (nom,code,directeur,email,adresse,num_tel,dr,creation_date,created_by) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)",
            [nom, code, directeur, email, adresse, num_tel, dr, creation_date, created_by]);
    }
}catch(err){
    res.status(400).json({
        status: "4000",
        status_message: "mauvaise requette ",
        result: err.detail
    });
}
}
const deleteAgencie = async (req, res, next) => {
    const { code } = req.body;
    try {
        await pool.query("DELETE from agence (code,directeur,email,adresse,num_tel,dr,password) VALUES ($1,$2,$3,$4,$5,$6,$7)", [code, directeur, email, adresse, num_tel, dr, hashedPwd]);
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
    getAllAgencies,
    getOneAgence,
    createAgencie,
    deleteAgencie,
    updateAgencie,
}
