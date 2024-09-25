const express = require('express');
const router = express.Router();
const policeController = require('../../controllers/policeController');
const verifyJWT = require('../../middleware/verifyJWT');
router.route('/')
    .get(verifyJWT,policeController.getAllPolices)
    .post(verifyJWT,policeController.createPolice)
    .put(verifyJWT,policeController.updatePolice)
    .delete(verifyJWT,policeController.deletePolice);

router.route('/:search_by&:search_value')
    .get(verifyJWT,policeController.getOnePolice);
    router.route('/:search_value')
    .get(policeController.getOnePolice);
module.exports = router;
