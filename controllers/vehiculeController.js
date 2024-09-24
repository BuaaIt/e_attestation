const pool = require('../db');
const bcrypt = require('bcrypt');
const saltRounds = 10;


const getAllVehicules = async (req, res, next) => {
    console.log('Get ALL vehicules  ');
    const vehicules = await pool.query("SELECT marque,type,annee,valeur,matricule,usage,puissance ," +
        "nbr_places, charge_utile,genre,num_chassis,conducteur,conducteur.nom,conducteur.prenom " +
        "FROM  vehicule " +
        "JOIN conducteur ON vehicule.conducteur = conducteur.nin "
    );
    if (vehicules.rowCount == 0) {
        res.status(404).json({
            status: "4004",
            status_message: "no data",
            result: vehicules.rows
        });

    } else {
        res.status(200).json({
            status: "2000",
            status_message: "success",
            result: vehicules.rows
        });

    }
    console.log('vehicules  ' + vehicules.rows[0]);

}

const getOneVehicule = async (req, res, next) => {
    const { matricule } = req.params;
    console.log('Get one agence  ' + matricule);
    const vehicule = await pool.query("SELECT marque,type,annee,valeur,matricule,usage,puissance ," +
        "nbr_places, charge_utile,genre,num_chassis,conducteur,conducteur.nom,conducteur.prenom " +
        "FROM  vehicule " +
        "JOIN conducteur ON vehicule.conducteur = conducteur.nin AND vehicule.matricule='" + matricule + "'"
    );
    console.log('agences  ' + vehicule.rows[0]);
    if(vehicule.rowCount == 0){
        res.status(404).json({
            status:"40004",
            status_message:"No data",
            result :vehicule.rows
        });
    }else{
        res.status(200).json({
            status:"2000",
            status_message:"success ",
            result :vehicule.rows
        });
    }
    res.status(201).send(vehicule.rows[0]);
}
const createVehicule = async (req, res, next) => {
    const { marque, type, annee, valeur,
        matricule, usage, puissance,
        nbr_places, charge_utile, genre,
        num_chassis, nom_conducteur,
        prenom_conducteur, nin_conducteur,
        police, tonnage } = req.body;
    try {
        const hashedPwd = await bcrypt.hash("123456", saltRounds);
        await pool.query("INSERT INTO vehicule (marque,type,annee,valeur,matricule,usage,puissance,nbr_places ,charge_utile,genre,num_chassis,conducteur,police,tonnage) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)",
            [marque, type, annee, valeur, matricule, usage, puissance,
                nbr_places, charge_utile, genre, num_chassis, nin_conducteur, police, tonnage]);
        res.status(201).json({
            "status": "2001",
            "status_message": "created successfully",
        });
    } catch (err) {
        res.status(401).json({
            status: "4001",
            status_message: "bad request ",
            result: err.detail
        });
        console.log(err.detail);
    }

}


const checkVehicule = async (req, res, next) => {
    const { matricule } = req.params
    const vehicule = await pool.query("SELECT marque,type,annee,valeur,matricule,usage,puissance ," +
        "nbr_places, charge_utile,genre,num_chassis,conducteur,conducteur.nom,conducteur.prenom " +
        "FROM  vehicule " +
        "JOIN conducteur ON vehicule.conducteur = conducteur.nin AND vehicule.matricule='" + matricule + "'"
    );
    if (vehicule.length == 0) {
        res.status(404).json({
            status: "4004",
            status_message: "no data",
            result:"vehicule non assure"
        });
    } else {
        res.status(200).json({
            status: "2000",
            status_message: "Vehicule assure",
            result: vehicule.rows[0]
        });
    }
}
const deleteVehicule = async (req, res, next) => {

    const { code } = req.body;
    try {
        await pool.query("DELETE from agence (code,directeur,email,address,num_tel,dr,password) VALUES ($1,$2,$3,$4,$5,$6,$7)", [code, directeur, email, address, num_tel, dr, hashedPwd]);
        res.status(200).json({
            "status": "200",
            "status_message": "agence created successfully",
        });

    } catch (err) {
        console.log(err);
    }


}
const updateVehicule = async (req, res, next) => {
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
    getAllVehicules,
    getOneVehicule,
    createVehicule,
    checkVehicule,
    deleteVehicule,
    updateVehicule,
}
