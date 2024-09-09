const pool = require('../db');

const comp=(req,res,next)=>{
res.render('compagnies',{layout : false});
}
const getAllCompagnies  = async (req , res ,next) => {
    console.log('Get ALL compagnies  ');
const compagnies = await pool.query("SELECT * FROM  compagnie");
console.log('compagnies  '+ compagnies.rows[0]);
res.status(201).send(compagnies);
}

const createCompagnie = async (req,res,next) =>{
const {nom,prenom,email,address}=req.body;

try{
await pool.query("INSERT INTO compagnie (nom,prenom,email,address) VALUES ($1,$2,$3,$4)",[nom,prenom,email,address]);
res.status(200).send({
    message : 'compagnie ajouter avec sucess'
})
}catch(err){
console.log(err);
}

}

const deleteCompagnie =async (req,res,next) => {

}

const updateCompagnie = async (req,res,next) => {

}



module.exports  =   {
    getAllCompagnies,
    createCompagnie,
    deleteCompagnie,
    updateCompagnie,
    comp
                    }
