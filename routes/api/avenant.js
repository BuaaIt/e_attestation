const express = require('express');
const router = express.Router();
const avenantController = require('../../controllers/avenantController');
const verifyJWT = require('../../middleware/verifyJWT');
router.route('/')
    .get(verifyJWT,avenantController.getAllAvenant)
    .post(verifyJWT,avenantController.createAvenant)
    .put(verifyJWT,avenantController.updateAvenant)
    .delete(verifyJWT,avenantController.deleteAvenant);

router.route('/:search_by&:search_value')
    .get(verifyJWT,avenantController.getOnePolice);
module.exports = router;
