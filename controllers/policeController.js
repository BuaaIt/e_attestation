const pool = require('../db');

const QRCode = require('qrcode');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const createPolice = async (req, res, next) => {
    const { nin_assure, nom_assure, prenom_assure, address_assure, num_tel
        , num_police, date_effet, date_echeance, date_souscription
        , prime_rc, taux_reduction, duree, agence, vehicules
    } = req.body;

    const attestation = await pool.connect();
    var qrCodeImage;
    const url = 'http://192.168.1.3:8080/attestation/np&' + num_police;
    try {
        QRCode.toDataURL(url, async function (err, generatedUrl) {

            if (nin_assure != null && nom_assure != null &&
                prenom_assure != null && address_assure != null &&
                num_tel != null

            ) {
                try {
                    //begin of transaction
                    await attestation.query('BEGIN');

                    //ajouter assure 
                    await attestation.query("INSERT INTO assure (nin,nom,prenom,address,num_tel) VALUES ($1,$2,$3,$4,$5) ON CONFLICT  (nin) DO NOTHING;",
                        [nin_assure, nom_assure, prenom_assure, address_assure, num_tel]);
                    // ajouter les informations de l'attestation 
                    await attestation.query("INSERT INTO police (num_police,date_effet,date_echeance,date_souscription,prime_rc,taux_reduction,duree,assure,agence,qr_code) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)",
                        [num_police, date_effet, date_echeance, date_souscription, prime_rc, taux_reduction, duree, nin_assure, agence, generatedUrl]);
                    //ajouter les informations du conducteur
                    //ajouter les informations du vehicule
                    //verifier le format de variable vehicule
                    if (Array.isArray(vehicules)) {
                        vehicules.forEach(async (vehicule) => {
                            console.log("marque vehicule " + vehicule.marque_vehicule);
                            await attestation.query("INSERT INTO vehicule (marque,type,annee,valeur,matricule,usage,puissance,nbr_places,charge_utile,genre,num_chassis,conducteur,police,tonnage) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)",
                                [vehicule.marque_vehicule, vehicule.type_vehicule, vehicule.annee_vehicule, vehicule.valeur_vehicule, vehicule.matricule, vehicule.usage_vehicule, vehicule.puissance_vehicule, vehicule.nbr_places, vehicule.cahrge_utile, vehicule.genre_vehicule, vehicule.num_chassis, "00111001012", num_police, vehicule.tonnage]

                            ).catch(e => {
                                res.status(401).json({
                                    status: "4001",
                                    status_message: 'vehicule deja existe',
                                    result: "",
                                });
                            });
                            const conducteur = vehicule.conducteur;
                            if (Array.isArray(conducteur)) {
                                conducteur.forEach(async (cond) => {
                                    await attestation.query("INSERT INTO conducteur (nom,prenom,nin) VALUES ($1,$2,$3) ON CONFLICT  (nin) DO NOTHING;",
                                        [cond.nom_conducteur, cond.prenom_conducteur, cond.nin_conducteur]);
                                    await attestation.query("INSERT INTO vehicule_conducteur (num_chassis,nin_conducteur) VALUES ($1,$2) ON CONFLICT (num_chassis,nin_conducteur) DO NOTHING;", [vehicule.num_chassis, cond.nin_conducteur]);
                                });
                            } else {
                                res.send(400).json({
                                    status: "4000",
                                    status_message: "bad request",
                                    result: "merci d'entere les donnes de conducteur sous forme de vecteur conducteur : [{'data1':data1,'data2':data2}]"
                                });
                            }

                        });
                    } else {
                        res.send(400).json({
                            status: "4000",
                            status_message: "bad request",
                            result: "merci d'entere les donnes de vehicule sous forme de vecteur vehicules : [{data1:data1,data2:data2}]"
                        });
                    }

                    await attestation.query('COMMIT');
                    //json response
                    res.status(200).json({
                        status: "2000",
                        status_message: "attestation created successfully",
                    });
                }
                catch (e) {
                    await attestation.query('ROLLBACK');
                    res.status(401).json({
                        status: "4001",
                        status_message: e.detail,
                    });

                } finally {
                    attestation.release();
                }
            }
        });
    } catch (err) {
        res.status(400).json({
            status: "4000",
            status_message: "Bad reqeust ",
            result: err.detail
        });
        console.log(err);
    }

}


const getOnePolice = async (req, res, next) => {
    const { search_by, search_value } = req.params;
    console.log('Get one attestation  ');
    var sqlQuery;
    // 'np'  ====> numero police
    if (typeof (search_by) === "undefined") {

        /*     sqlQuery = "SELECT vehicule.marque , vehicule.type, vehicule.annee , vehicule.valeur, vehicule.matricule, " +
                 "vehicule.usage, vehicule.puissance, vehicule.nbr_places , vehicule.charge_utile, vehicule.genre, " +
                 "vehicule.num_chassis, vehicule.conducteur , vehicule.police, vehicule.tonnage ," +
                 "police.num_police, " +
                 "police.date_effet,police.date_echeance,police.date_souscription,police.prime_rc," +
                 "police.taux_reduction,police.duree,police.agence," +
                 "assure.nom,assure.prenom,assure.address,assure.nin ,assure.num_tel, " +
                 "conducteur.nom , conducteur.prenom , conducteur.nin " +
                 "FROM vehicule " +
                 "JOIN police ON police.num_police=$1 AND vehicule.police=police.num_police " +
                 "JOIN assure ON police.assure=assure.nin " +
                 "INNER JOIN vehicule_conducteur ON vehicule.num_chassis=vehicule_conducteur.num_chassis";    */
    } else {
        if (search_by === 'np') {
            //****************************************************** */

            sqlQuery = "SELECT police.num_police, " +
                "police.date_effet,police.date_echeance,police.date_souscription,police.prime_rc," +
                "police.taux_reduction,police.duree,police.agence,police.qr_code, " +
                " assure.nom , assure.prenom , assure.address, assure.nin ,assure.num_tel, " +
                " agence.nom AS nom_agence, compagnie.nom AS nom_compagnie, " +
                "JSON_AGG(json_build_object('marque',vehicule.marque ,'type', vehicule.type,'annee', vehicule.annee , " +
                "'valeur', vehicule.valeur,'matricule', vehicule.matricule, " +
                "'usage',vehicule.usage,'puissance', vehicule.puissance,'nbr_places', vehicule.nbr_places ,'charge_utile', vehicule.charge_utile,'genre', vehicule.genre, " +
                "'num_chassis',vehicule.num_chassis, 'marque', vehicule.tonnage" +
                ")) as vehicules " +
                "FROM police " +
                "JOIN vehicule ON vehicule.police=police.num_police AND police.num_police=$1 " +
                "JOIN agence ON police.agence=agence.code " +
                "JOIN dr ON agence.dr=dr.code " +
                "JOIN compagnie ON dr.compagnie = compagnie.id " +
                "JOIN assure ON police.assure=assure.nin " +
                "GROUP BY police.num_police ,assure.nin , agence.code , compagnie.id ";
            //*************************************************************** */    
            // 'nm'  ====> numero matricule
        } else if (search_by === 'nm') {

            sqlQuery = "SELECT police.num_police, " +
                "police.date_effet,police.date_echeance,police.date_souscription,police.prime_rc," +
                "police.taux_reduction,police.duree,police.agence,police.qr_code, " +
                "JSON_AGG(json_build_object('marque',vehicule.marque ,'type', vehicule.type,'annee', vehicule.annee , " +
                "'valeur', vehicule.valeur,'matricule', vehicule.matricule, " +
                "'usage',vehicule.usage,'puissance', vehicule.puissance,'nbr_places', vehicule.nbr_places ,'charge_utile', vehicule.charge_utile,'genre', vehicule.genre, " +
                "'num_chassis',vehicule.num_chassis, 'marque', vehicule.tonnage" +
                ")) as vehicules " +
                "FROM police " +
                "JOIN vehicule ON vehicule.police=police.num_police AND vehicule.matricule=$1 " +
                "JOIN assure ON police.assure=assure.nin " +
                "GROUP BY police.num_police";

            /* sqlQuery = "SELECT vehicule.marque , vehicule.type, vehicule.annee , vehicule.valeur, vehicule.matricule, " +
                 "vehicule.usage, vehicule.puissance, vehicule.nbr_places , vehicule.charge_utile, vehicule.genre, " +
                 "vehicule.num_chassis, vehicule.conducteur , vehicule.police, vehicule.tonnage ," +
                 "police.num_police, " +
                 "police.date_effet,police.date_echeance,police.date_souscription,police.prime_rc," +
                 "police.taux_reduction,police.duree,police.agence," +
                 "assure.nom,assure.prenom,assure.address,assure.nin ,assure.num_tel, " +
                 "conducteur.nom , conducteur.prenom , conducteur.nin " +
                 "FROM vehicule " +
                 "JOIN police ON vehicule.police=police.num_police AND vehicule.matricule=$1 " +
                 "JOIN assure ON police.assure=assure.nin " +
                 "LEFT JOIN conducteur ON vehicule.conducteur=conducteur.nin";*/
            //************************************************************* */
            // 'na'  ====> nom assure
        } else if (search_by === 'na') {

            sqlQuery = "SELECT police.num_police, " +
                "police.date_effet,police.date_echeance,police.date_souscription,police.prime_rc," +
                "police.taux_reduction,police.duree,police.agence,police.qr_code, " +
                "JSON_AGG(json_build_object('marque',vehicule.marque ,'type', vehicule.type,'annee', vehicule.annee , " +
                "'valeur', vehicule.valeur,'matricule', vehicule.matricule, " +
                "'usage',vehicule.usage,'puissance', vehicule.puissance,'nbr_places', vehicule.nbr_places ,'charge_utile', vehicule.charge_utile,'genre', vehicule.genre, " +
                "'num_chassis',vehicule.num_chassis, 'marque', vehicule.tonnage" +
                ")) as vehicules " +
                "FROM police " +
                "JOIN vehicule ON vehicule.police=police.num_police " +
                "JOIN assure ON police.assure=assure.nin AND assure.nom=$1 " +
                "GROUP BY police.num_police";

            //******************************************************************** */
            // 'nc'  ====> numero chassis
        } else if (search_by === 'nc') {

            sqlQuery = "SELECT police.num_police, " +
                "police.date_effet,police.date_echeance,police.date_souscription,police.prime_rc," +
                "police.taux_reduction,police.duree,police.agence,police.qr_code, " +
                +" assure.nom , assure.prenom , assure.address, assure.nin ,assure.num_tel, " +
                "JSON_AGG(json_build_object('marque',vehicule.marque ,'type', vehicule.type,'annee', vehicule.annee , " +
                "'valeur', vehicule.valeur,'matricule', vehicule.matricule, " +
                "'usage',vehicule.usage,'puissance', vehicule.puissance,'nbr_places', vehicule.nbr_places ,'charge_utile', vehicule.charge_utile,'genre', vehicule.genre, " +
                "'num_chassis',vehicule.num_chassis, 'marque', vehicule.tonnage" +
                ")) as vehicules " +
                "FROM police " +
                "JOIN vehicule ON vehicule.police=police.num_police AND vehichule.num_chassis =$1 " +
                "JOIN assure ON police.assure=assure.nin " +
                "GROUP BY police.num_police";

        }
    }

    const attestation = await pool.query(sqlQuery, [search_value]);
    console.log('compagnies  ' + attestation.rows[0]);

    if (attestation.rows.length == 0) {
        res.status(404).json({
            "status": "4004",
            "status_message": "no data",
            "result": "not found",
        });
    } else {
        res.header('token', JSON.stringify({
            "status": "2000",
            "status_message": "success",
            "result": attestation.rows,
        }));
        let result = attestation.rows;

        res.render('fnva',
            {
                layout: false,
                result
            });
        /* res.status(200).json({
             "status": "2000",
             "status_message": "success",
             "result": attestation.rows,
         });*/
    }

}
const getAllPolices = async (req, res, next) => {
    console.log('Get ALL attestations  ');
    const police = await pool.query(
        "SELECT police.num_police, " +
        "police.date_effet,police.date_echeance,police.date_souscription,police.prime_rc," +
        "police.taux_reduction,police.duree,police.agence,police.qr_code, " +
        "JSON_AGG(json_build_object('marque',vehicule.marque ,'type', vehicule.type,'annee', vehicule.annee , " +
        "'valeur', vehicule.valeur,'matricule', vehicule.matricule, " +
        "'usage',vehicule.usage,'puissance', vehicule.puissance,'nbr_places', vehicule.nbr_places ,'charge_utile', vehicule.charge_utile,'genre', vehicule.genre, " +
        "'num_chassis',vehicule.num_chassis, 'marque', vehicule.tonnage" +
        ")) as vehicules " +
        "FROM police " +
        "JOIN vehicule ON vehicule.police=police.num_police " +
        "JOIN assure ON police.assure=assure.nin " +
        "GROUP BY police.num_police"
    );

    const vehicu = await pool.query(
        "SELECT vehicule.marque , vehicule.type, vehicule.annee , vehicule.valeur, vehicule.matricule, " +
        "vehicule.usage, vehicule.puissance, vehicule.nbr_places , vehicule.charge_utile, vehicule.genre, " +
        "vehicule.num_chassis, vehicule.conducteur , vehicule.police, vehicule.tonnage ," +
        "police.num_police, " +
        "police.date_effet,police.date_echeance,police.date_souscription,police.prime_rc," +
        "police.taux_reduction,police.duree,police.agence,police.qr_code," +
        "assure.nom,assure.prenom,assure.address,assure.nin ,assure.num_tel, " +
        "conducteur.nom , conducteur.prenom , conducteur.nin " +
        "FROM vehicule " +
        "JOIN police ON vehicule.police=police.num_police " +
        "JOIN assure ON police.assure=assure.nin " +
        "JOIN vehicule_conducteur ON vehicule.num_chassis=vehicule_conducteur.num_chassis " +
        "JOIN conducteur ON  conducteur.nin=vehicule_conducteur.nin_conducteur"
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
        res.status(404).json({
            "status": "4004",
            status_message: "no data ",
            "result": "no compagnie on the data base",
        });
    } else {
        res.status(200).json({
            "status": "2000",
            status_message: "success",
            "result": police.rows,
        });
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



/*
try {
    const url = 'http://localhost:8080/compagnies/'+email+'&'+n_police;
    QRCode.toDataURL(url, async function (err, uurl) {
        qrCodeImage = uurl;
        console.log("qr code :"+qrCodeImage);
        await pool.query("INSERT INTO compagnie (nom,prenom,email,address,n_police,qr_code) VALUES ($1,$2,$3,$4,$5,$6)", [nom, prenom, email, address,n_police,qrCodeImage]);
        res.status(200).send({
            message: 'compagnie ajouter avec sucess'
        });
    });
} catch (err) {
    console.log(err);
}

*/


module.exports = {
    getOnePolice,
    getAllPolices,
    createPolice,
    deletePolice,
    updatePolice,
}
