const pool = require('../db');

const getAllAssure = async (req, res, next) => {
    console.log('Get ALL assure  ');
    const assures = await pool.query("SELECT * FROM  assure");
    console.log('assures  ' + assures.rows[0]);
    if(assures.rowCount == 0){
        res.status(404).json({
            status:"4004",
            status_message:"no assure found",
            result : assures.rows});    
    }else{
        res.status(200).json({
            status:"2000",
            status_message:"All assures",
            result : assures.rows});
    }
    
}
const createAssure = async (req, res, next) => {
    const { nom, prenom,address, num_police , nin, num_tel } = req.body;
    try {

        await pool.query("INSERT INTO assure (nom, prenom,address, num_police , nin, num_tel) VALUES ($1,$2,$3,$4,$5,$6)", [nom, prenom,address, num_police , nin, num_tel]);
            res.status(201).json({
                status:"2001",
                status_message:"assure ajouter avec success",
                result: 'assure ajouter avec sucess'
            });
    } catch (err) {
        res.status(400).json({
            status:"4000",
            status_message:"bad request",
            result: err.detail
        });
        console.log(err);
    }

}

const deleteAssure = async (req, res, next) => {


}

const updateassure = async (req, res, next) => {
    const query = '';
    const { nom, prenom, email, address } = req.body;


    try {
        await pool.query("INSERT INTO assure (nom,prenom,email,address) VALUES ($1,$2,$3,$4)", [nom, prenom, email, address]);
        res.status(200).send({
            message: 'compagnie ajouter avec sucess'
        })
    } catch (err) {
        console.log(err);
    }


}



module.exports = {
    getAllAssure,
    createAssure,
    deleteAssure,
    updateassure,
}
