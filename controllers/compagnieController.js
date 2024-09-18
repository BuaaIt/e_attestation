const pool = require('../db');

const QRCode = require('qrcode');
const bcrypt = require('bcrypt');
const saltRounds = 10;

//test function
const comp = async (req, res, next) => {
    const {matricule,police_n} = req.params;
    console.log("  test : ");
    //res.send('compagnies '+matricule+" police "+police_n);

    console.log('Get  compagnies by matricule and police number  ');
    const compagnies = await pool.query("SELECT * FROM  compagnie WHERE matricule='"+matricule+"' AND n_police='"+police_n+"'");
    console.log('compagnies  ' + compagnies.rows[0]);
    res.status(201).send(compagnies.rows);



}

const getAllCompagnies = async (req, res, next) => {
    console.log('Get ALL compagnies  ');
    const compagnies = await pool.query("SELECT * FROM  compagnie");
    console.log('compagnies  ' + compagnies.rows[0]);
    res.status(201).send(compagnies.rows);
}
const createCompagnie = async (req, res, next) => {
    const { email, nom, directeur, num_tel,address } = req.body;
    const hashedPwd = await bcrypt.hash("123456", saltRounds);
    try {
        const url = 'http://localhost:8080/compagnies/'+email+'&'+n_police;
        QRCode.toDataURL(url, async function (err, uurl) {
            qrCodeImage = uurl;
            console.log("qr code :"+qrCodeImage);
            await pool.query("INSERT INTO compagnie (nom,prenom,email,address,n_police,qr_code,password) VALUES ($1,$2,$3,$4,$5,$6,$7)", [nom, prenom, email, address,n_police,qrCodeImage,hashedPwd]);
            res.status(200).send({
                message: 'compagnie ajouter avec sucess'
            });
        });
    } catch (err) {
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
    getAllCompagnies,
    createCompagnie,
    deleteCompagnie,
    updateCompagnie,
    comp
}
