const express = require('express');
const router = express.Router();
const compagnieController = require('../../controllers/compagnieController');
const verifyJWT = require('../../middleware/verifyJWT');
router.route('/')
    .get(verifyJWT,compagnieController.getAllCompagnies)
    .post(verifyJWT,compagnieController.createCompagnie)
    .put(verifyJWT,compagnieController.updateCompagnie)
    .delete(verifyJWT,compagnieController.deleteCompagnie);

router.route('/:id')
    .get(compagnieController.getOneCompagnie);
module.exports = router;
