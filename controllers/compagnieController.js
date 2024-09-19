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



const getOneCompagnie = async (req, res, next) => {
    const {id}=req.params;
    console.log('Get one compagnie  ');
    const compagnie = await pool.query("SELECT id,nom,email,num_tel,address,creation_date,created_by FROM  compagnie where id='"+id+"'");
    console.log('compagnies  ' + compagnie.rows[0]);

    if(compagnie.rows.length == 0){
        res.status(201).json({
            "status":"404",
            "status_message":"compagnie doesnt exist",
            "result":"not found",
            });
    }else{
        res.status(201).json({
            "status":"200",
            "status_message":"success",
            "result":compagnie.rows[0],
            });
    }
    
}

const getAllCompagnies = async (req, res, next) => {
    console.log('Get ALL compagnies  ');
    const compagnies = await pool.query("SELECT id,nom,email,num_tel,address,creation_date,created_by FROM  compagnie");
    console.log('compagnies  ' + compagnies.rows[0]);
    if(compagnies.rows.length ==0){
        res.status(201).json({
            "status":"404",
            status_message:"empty ",
            "result":"no compagnie on the data base",
            });
    }else{
        res.status(201).json({
            "status":"200",
            status_message:"success",
            "result":compagnies.rows,
            });
    }
    
}
const createCompagnie = async (req, res, next) => {
    const { id, email, nom, num_tel, address, creation_date, created_by } = req.body;

    try {
        const hashedPwd = await bcrypt.hash("123456", saltRounds);
        await pool.query("INSERT INTO compagnie (id,email,nom,num_tel,address,creation_date,created_by,password) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)", [id, email, nom, num_tel, address, creation_date, created_by, hashedPwd]);
        res.status(200).json({
            "status": "200",
            "status_message": "compagnie created successfully",
        });
    } catch (err) {
        res.status(200).json({
            "status": "404",
            "status_message": "Error",
            err
        });
        console.log(err);
    }

}

const deleteCompagnie = async (req, res, next) => {


}

const updateCompagnie = async (req, res, next) => {
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
    getOneCompagnie,
    getAllCompagnies,
    createCompagnie,
    deleteCompagnie,
    updateCompagnie,
    comp
}
