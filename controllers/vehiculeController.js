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