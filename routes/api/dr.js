const express = require('express');
const router = express.Router();
const drController = require('../../controllers/drController');
const verifyJWT = require('../../middleware/verifyJWT');
router.route('/')
    .get(verifyJWT,drController.getAllDrs)
    .post(verifyJWT,drController.createDr)
    .put(verifyJWT,drController.updateDr)
    .delete(verifyJWT,drController.deleteDr);

router.route('/:code')
    .get(verifyJWT,drController.getOneDr);
module.exports = router;
