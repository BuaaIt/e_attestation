const express = require('express');
const router = express.Router();
const compagnieController = require('../../controllers/compagnieController');
const verifyJWT = require('../../middleware/verifyJWT');
router.route('/')
    .get(verifyJWT,compagnieController.getAllCompagnies)
    .post(compagnieController.createCompagnie)
    .put(compagnieController.updateCompagnie)
    .delete(compagnieController.deleteCompagnie);

router.route('/:id')
    .get(compagnieController.getAllCompagnies);
module.exports = router;
