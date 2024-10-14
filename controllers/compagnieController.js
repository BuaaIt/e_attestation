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
    const compagnies = await pool.query("SELECT * FROM  compagnie WHERE matricule=$1 AND n_police=$2",[matricule,police_n]);
    console.log('compagnies  ' + compagnies.rows[0]);
    res.status(201).send(compagnies.rows);
}

//************************************************* */

const getOneCompagnie = async (req, res, next) => {
    const {id}=req.params;
    console.log('Get one compagnie  ');
    const compagnie = await pool.query("SELECT code,nom,email,num_tel,address,creation_date,created_by FROM  compagnie where code=$1",[id]);
    console.log('compagnies  ' + compagnie.rows[0]);

    if(compagnie.rows.length == 0){
        res.status(404).json({
            "status":"4004",
            "status_message":"do not existe",
            "result":"empty",
            });
    }else{
        res.status(200).json({
            "status":"2000",
            "status_message":"success",
            "result":compagnie.rows[0],
            });
    }
}

const getAllCompagnies = async (req, res, next) => {
    console.log('Get ALL compagnies  ');
    const compagnies = await pool.query("SELECT code,nom,email,num_tel,address,creation_date,created_by FROM compagnie");
    console.log('compagnies  '+compagnies.rows[0]);
    if(compagnies.rows.length ==0){
        res.status(404).json({
            "status":"4004",
            status_message:"empty ",
            "result":"no compagnie on the data base",
            });
    }else{
        res.status(200).json({
            "status":"2000",
            status_message:"success",
            "result":compagnies.rows,
            });
    }
    
}
const createCompagnie = async (req, res, next) => {
    const { id, email, nom, num_tel, address, creation_date, created_by } = req.body;
    const compagnie= await pool.connect();
    try {
        const hashedPwd = await bcrypt.hash("123456", saltRounds);
        await compagnie.query('BEGIN');
        await compagnie.query("INSERT INTO compagnie (code,email,nom,num_tel,address,creation_date,created_by,password) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)",
             [id, email, nom, num_tel, address, creation_date, created_by, hashedPwd]);
             await compagnie.query("INSERT INTO compte (username,code_structure,password,role,creation_date,created_by) VALUES ($1,$2,$3,$4,$5,$6)",
                [email,id, hashedPwd, 'compagnie', creation_date, created_by]);
             await compagnie.query('COMMIT');
             res.status(201).json({
            status:"2001",
            status_message:"success ",
            result:"Compagnie ajouter avec success"
        });
    } catch (err) {
        await compagnie.query('ROLLBACK');
        res.status(400).json({
            status:"4000",
            status_message:"bad request ",
            result:err.detail
        });
        console.log(err);
    }finally{
        compagnie.release();
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
