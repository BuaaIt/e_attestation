const express = require('express');
const router = express.Router();
const vehiculeController = require('../../controllers/vehiculeController');
const verifyJWT = require('../../middleware/verifyJWT');
router.route('/')
    .get(verifyJWT,vehiculeController.getAllVehicules)
    .post(verifyJWT,vehiculeController.createVehicule)
    .put(verifyJWT,vehiculeController.updateVehicule)
    .delete(verifyJWT,vehiculeController.deleteVehicule);

router.route('/:matricule')
    .get(verifyJWT,vehiculeController.checkVehicule); //or getOne vehicule infomrations
module.exports = router;
