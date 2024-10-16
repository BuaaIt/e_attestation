const express = require('express');
const router = express.Router();
const compteController = require('../../controllers/compteController');
const verifyJWT = require('../../middleware/verifyJWT');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');
router.route('/')
    .get(verifyJWT,compteController.getAllComptes)
    .post(verifyJWT,compteController.createCompte)
    .put(verifyJWT,compteController.updateCompte)
    .delete(verifyJWT,compteController.deleteCompte);

router.route('/:username')
    .get(verifyJWT,compteController.getOneCompte);
module.exports = router;
