const express = require('express');
const router = express.Router();
const policeController = require('../../controllers/policeController');
const verifyJWT = require('../../middleware/verifyJWT');
router.route('/')
    .get(verifyJWT,policeController.getAllPolices)
    .post(verifyJWT,policeController.createPolice)
    .put(verifyJWT,policeController.updatePolice)
    .delete(verifyJWT,policeController.deletePolice);

router.route('/:num_police')
    .get(verifyJWT,policeController.getOnePolice);
module.exports = router;
