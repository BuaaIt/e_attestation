const express = require('express');
const router = express.Router();
const agenceController = require('../../controllers/agencesController');
const verifyJWT = require('../../middleware/verifyJWT');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');
router.route('/')
    .get(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.buaa,ROLES_LIST.dr, ROLES_LIST.compagnie,ROLES_LIST.agence),verifyJWT,agenceController.getAllAgencies)
    .post(verifyJWT,agenceController.createAgencie)
    .put(verifyJWT,agenceController.updateAgencie)
    .delete(verifyJWT,agenceController.deleteAgencie);

router.route('/:code')
    .get(verifyJWT,agenceController.getOneAgence);
module.exports = router;
