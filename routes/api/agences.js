const express = require('express');
const router = express.Router();
const agenceController = require('../../controllers/agencesController');
const verifyJWT = require('../../middleware/verifyJWT');
router.route('/')
    .get(verifyJWT,agenceController.getAllAgencies)
    .post(verifyJWT,agenceController.createAgencie)
    .put(verifyJWT,agenceController.updateAgencie)
    .delete(verifyJWT,agenceController.deleteAgencie);

router.route('/:matricule&:police_n')
    .get();
module.exports = router;
