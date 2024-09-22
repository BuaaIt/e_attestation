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
    const { num_police, matricule,nom_assure, num_chassis} = req.params;
    console.log('Get one attestation  ');
    var sqlQuery;
    if(typeof num_police !== 'undefined'){
        //****************************************************** */
        sqlQuery ="SELECT vehicule.marque , vehicule.type, vehicule.annee , vehicule.valeur, vehicule.matricule, " +
        "vehicule.usage, vehicule.puissance, vehicule.nbr_places , vehicule.charge_utile, vehicule.genre, " +
        "vehicule.num_chassis, vehicule.conducteur , vehicule.police, vehicule.tonnage ," +
        "police.num_police, " +
        "police.date_effet,police.date_echeance,police.date_souscription,police.prime_rc," +
        "police.taux_reduction,police.duree,police.agence," +
        "assure.nom,assure.prenom,assure.address,assure.nin ,assure.num_tel, " +
        "conducteur.nom , conducteur.prenom , conducteur.nin "+
        "FROM vehicule " +
        "JOIN police ON police.num_police='AB2002' AND vehicule.police=police.num_police " +
        "JOIN assure ON police.assure=assure.nin "+
        "LEFT JOIN conducteur ON vehicule.conducteur=conducteur.nin";
        //*************************************************************** */
    }else if(typeof matricule !== 'undefined'){
        sqlQuery =        "SELECT vehicule.marque , vehicule.type, vehicule.annee , vehicule.valeur, vehicule.matricule, " +
        "vehicule.usage, vehicule.puissance, vehicule.nbr_places , vehicule.charge_utile, vehicule.genre, " +
        "vehicule.num_chassis, vehicule.conducteur , vehicule.police, vehicule.tonnage ," +
        "police.num_police, " +
        "police.date_effet,police.date_echeance,police.date_souscription,police.prime_rc," +
        "police.taux_reduction,police.duree,police.agence," +
        "assure.nom,assure.prenom,assure.address,assure.nin ,assure.num_tel, " +
        "conducteur.nom , conducteur.prenom , conducteur.nin "+
        "FROM vehicule " +
        "JOIN police ON vehicule.police=police.num_police " +
        "JOIN assure ON police.assure=assure.nin "+
        "LEFT JOIN conducteur ON vehicule.conducteur=conducteur.nin";
        //************************************************************* */
    }else if(typeof nom_assure !== 'undefined'){
        sqlQuery =        "SELECT vehicule.marque , vehicule.type, vehicule.annee , vehicule.valeur, vehicule.matricule, " +
        "vehicule.usage, vehicule.puissance, vehicule.nbr_places , vehicule.charge_utile, vehicule.genre, " +
        "vehicule.num_chassis, vehicule.conducteur , vehicule.police, vehicule.tonnage ," +
        "police.num_police, " +
        "police.date_effet,police.date_echeance,police.date_souscription,police.prime_rc," +
        "police.taux_reduction,police.duree,police.agence," +
        "assure.nom,assure.prenom,assure.address,assure.nin ,assure.num_tel, " +
        "conducteur.nom , conducteur.prenom , conducteur.nin "+
        "FROM vehicule " +
        "JOIN police ON vehicule.police=police.num_police " +
        "JOIN assure ON police.assure=assure.nin "+
        "LEFT JOIN conducteur ON vehicule.conducteur=conducteur.nin";

        //******************************************************************** */
    }else if(typeof num_chassis !== 'undefined'){
        sqlQuery =        "SELECT vehicule.marque , vehicule.type, vehicule.annee , vehicule.valeur, vehicule.matricule, " +
        "vehicule.usage, vehicule.puissance, vehicule.nbr_places , vehicule.charge_utile, vehicule.genre, " +
        "vehicule.num_chassis, vehicule.conducteur , vehicule.police, vehicule.tonnage ," +
        "police.num_police, " +
        "police.date_effet,police.date_echeance,police.date_souscription,police.prime_rc," +
        "police.taux_reduction,police.duree,police.agence," +
        "assure.nom,assure.prenom,assure.address,assure.nin ,assure.num_tel, " +
        "conducteur.nom , conducteur.prenom , conducteur.nin "+
        "FROM vehicule " +
        "JOIN police ON vehicule.police=police.num_police " +
        "JOIN assure ON police.assure=assure.nin "+
        "LEFT JOIN conducteur ON vehicule.conducteur=conducteur.nin";
    }

    
    
    const attestation = await pool.query(sqlQuery);
    console.log('compagnies  ' + attestation.rows[0]);

    if (attestation.rows.length == 0) {
        res.status(201).json({
            "status": "404",
            "status_message": "attestation doesnt exist",
            "result": "not found",
        });
    } else {
        res.status(201).json({
            "status": "200",
            "status_message": "success",
            "result": attestation.rows,
        });
    }

}
const getAllPolices = async (req, res, next) => {
    console.log('Get ALL compagnies  ');
    const police = await pool.query(
        "SELECT vehicule.marque , vehicule.type, vehicule.annee , vehicule.valeur, vehicule.matricule, " +
        "vehicule.usage, vehicule.puissance, vehicule.nbr_places , vehicule.charge_utile, vehicule.genre, " +
        "vehicule.num_chassis, vehicule.conducteur , vehicule.police, vehicule.tonnage ," +
        "police.num_police, " +
        "police.date_effet,police.date_echeance,police.date_souscription,police.prime_rc," +
        "police.taux_reduction,police.duree,police.agence," +
        "assure.nom,assure.prenom,assure.address,assure.nin ,assure.num_tel, " +
        "conducteur.nom , conducteur.prenom , conducteur.nin "+
        "FROM vehicule " +
        "JOIN police ON vehicule.police=police.num_police " +
        "JOIN assure ON police.assure=assure.nin "+
        "LEFT JOIN conducteur ON vehicule.conducteur=conducteur.nin"
    );
    


const avenants = await pool.query(
    "SELECT vehicule.marque , vehicule.type, vehicule.annee , vehicule.valeur, vehicule.matricule, " +
    "vehicule.usage, vehicule.puissance, vehicule.nbr_places , vehicule.charge_utile, vehicule.genre, " +
    "vehicule.num_chassis, vehicule.conducteur , vehicule.police, vehicule.tonnage ," +
    "police.num_police, " +
    "police.date_effet,police.date_echeance,police.date_souscription,police.prime_rc," +
    "police.taux_reduction,police.duree,police.agence," +
    "assure.nom,assure.prenom,assure.address,assure.nin ,assure.num_tel " +
    "FROM vehicule " +
    "JOIN police ON vehicule.police=police.num_police " +
    "JOIN assure ON police.assure=assure.nin "
);
    
    if (police.rows.length == 0) {
        res.status(201).json({
            "status": "404",
            status_message: "empty ",
            "result": "no compagnie on the data base",
        });
    } else {
        res.status(201).json({
            "status": "200",
            status_message: "success",
            "result": police.rows,
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
            [num_police, date_effet, date_echeance, date_souscription, prime_rc, taux_reduction, duree, nin_assure, agence]);
        await pool.query("INSERT INTO conducteur (nom,prenom,nin) VALUES ($1,$2,$3)",
            [nom_conducteur, prenom_conducteur, nin_conducteur]);
        await pool.query("INSERT INTO vehicule (marque,type,annee,valeur,matricule,usage,puissance,nbr_places,charge_utile,genre,num_chassis,conducteur,police,tonnage) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)",
            [marque_vehicule, type_vehicule, annee_vehicule, valeur_vehicule, matricule, usage_vehicule, puissance_vehicule, nbr_places, cahrge_utile, genre_vehicule, num_chassis, nin_conducteur, num_police, tonnage]);
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
