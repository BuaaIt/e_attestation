const pool = require('../db');

const getAllConducteurs = async (req, res, next) => {
    console.log('Get ALL conducteurs  ');
    const conducteurs = await pool.query("SELECT * FROM  conducteur");
    console.log('conducteurs  ' + conducteurs.rows[0]);
    res.status(201).send(conducteurs.rows);
}
const createConducteur = async (req, res, next) => {
    const {nom, prenom, nin } = req.body;
    try {
        
        await pool.query("INSERT INTO conducteur (nom,prenom,nin) VALUES ($1,$2,$3)", [nom, prenom,nin]);
        res.status(200).send({
            message: 'conducteur ajouter avec sucess'
        });
     
    } catch (err) {
        console.log(err);
    }

}

const deleteConducteur = async (req, res, next) => {


}
const updateConducteur = async (req, res, next) => {
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
    getAllConducteurs,
    createConducteur,
    deleteConducteur,
    updateConducteur,
}
