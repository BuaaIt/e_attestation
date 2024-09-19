const express = require('express');
const router = express.Router();
const agenceController = require('../../controllers/agencesController');
const verifyJWT = require('../../middleware/verifyJWT');
router.route('/')
    .get(verifyJWT,agenceController.getAllAgencies)
    .post(verifyJWT,agenceController.createAgencie)
    .put(verifyJWT,agenceController.updateAgencie)
    .delete(verifyJWT,agenceController.deleteAgencie);

router.route('/:code')
    .get(verifyJWT,agenceController.getOneAgence);
module.exports = router;
