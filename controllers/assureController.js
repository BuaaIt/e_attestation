const pool = require('../db');




const getAllAssure = async (req, res, next) => {
    console.log('Get ALL compagnies  ');
    const compagnies = await pool.query("SELECT * FROM  compagnie");
    console.log('compagnies  ' + compagnies.rows[0]);
    res.status(201).send(compagnies.rows);
}
const createAssure = async (req, res, next) => {
    const { email, nom, directeur, num_tel,address } = req.body;
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

}

const deleteAssure = async (req, res, next) => {


}

const updateassure = async (req, res, next) => {
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
    getAllAssure,
    createAssure,
    deleteAssure,
    updateassure,
}
