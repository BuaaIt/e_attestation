const pool = require('../db');

const QRCode = require('qrcode');
const bcrypt = require('bcrypt');
const saltRounds = 10;

//test function
const comp = async (req, res, next) => {
    const { matricule, police_n } = req.params;
    console.log("  test : ");
    //res.send('compagnies '+matricule+" police "+police_n);

    console.log('Get  compagnies by matricule and police number  ');
    const compagnies = await pool.query("SELECT * FROM  compagnie WHERE matricule='" + matricule + "' AND n_police='" + police_n + "'");
    console.log('compagnies  ' + compagnies.rows[0]);
    res.status(201).send(compagnies.rows);
}



const getOnePolice = async (req, res, next) => {
    const { id } = req.params;
    console.log('Get one compagnie  ');
    const compagnie = await pool.query("SELECT id,nom,email,num_tel,address,creation_date,created_by FROM  compagnie where id='" + id + "'");
    console.log('compagnies  ' + compagnie.rows[0]);

    if (compagnie.rows.length == 0) {
        res.status(201).json({
            "status": "404",
            "status_message": "compagnie doesnt exist",
            "result": "not found",
        });
    } else {
        res.status(201).json({
            "status": "200",
            "status_message": "success",
            "result": compagnie.rows[0],
        });
    }

}

const getAllPolices = async (req, res, next) => {
    console.log('Get ALL compagnies  ');
    const compagnies = await pool.query("SELECT id,nom,email,num_tel,address,creation_date,created_by FROM  compagnie");
    console.log('compagnies  ' + compagnies.rows[0]);
    if (compagnies.rows.length == 0) {
        res.status(201).json({
            "status": "404",
            status_message: "empty ",
            "result": "no compagnie on the data base",
        });
    } else {
        res.status(201).json({
            "status": "200",
            status_message: "success",
            "result": compagnies.rows,
        });
    }

}
const createPolice = async (req, res, next) => {
    const { nin_assure, nom_assure, prenom_assure, address_assure, num_tel
        , num_police, date_effet, date_echeance, date_souscription
        , prime_rc, taux_reduction, duree, agence, nom_conducteur, prenom_conducteur
        , nin_conducteur, marque_vehicule, type_vehicule, annee_vehicule, valeur_vehicule
        , matricule, usage_vehicule, puissance_vehicule, nbr_places, cahrge_utile, genre_vehicule
        , num_chassis, tonnage
    } = req.body;

    try {
        await pool.query("INSERT INTO assure (nin,nom,prenom,address,num_tel) VALUES ($1,$2,$3,$4,$5) ON CONFLICT  (nin) DO NOTHING;", [nin_assure, nom_assure, prenom_assure, address_assure, num_tel]);
        await pool.query("INSERT INTO police (num_police,date_effet,date_echeance,date_souscription,prime_rc,taux_reduction,duree,assure,agence) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)",
            [num_police, date_effet, date_echeance, date_souscription, prime_rc, taux_reduction, duree, nin_assure,agence]);
        await pool.query("INSERT INTO conducteur (nom,prenom,nin) VALUES ($1,$2,$3)",
            [nom_conducteur, prenom_conducteur, nin_conducteur]);
        await pool.query("INSERT INTO vehicule (marque,type,annee,valeur,matricule,usage,puissance,nbr_places,charge_utile,genre,num_chassis,conducteur,police,tonnage) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)", 
            [marque_vehicule, type_vehicule, annee_vehicule, valeur_vehicule, matricule, usage_vehicule, puissance_vehicule, nbr_places,cahrge_utile,genre_vehicule,num_chassis,nin_conducteur,num_police,tonnage]);
        //json response
        res.status(200).json({
            "status": "200",
            "status_message": "attestation created successfully",
        });
    } catch (err) {
        res.status(404).json({
            status: "404",
            status_message: "un problem ",
            result: err.detail
        });
        console.log(err);
    }

}

const deletePolice = async (req, res, next) => {


}

const updatePolice = async (req, res, next) => {
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
    getOnePolice,
    getAllPolices,
    createPolice,
    deletePolice,
    updatePolice,
    comp
}
