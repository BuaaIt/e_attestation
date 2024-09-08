const express = require('express');
const router = express.Router();
const compagnieController = require('../../controllers/compagnieController');

router.route('/')
    .get(compagnieController.getAllCompanies)
    .post()
    .put()
    .delete();

router.route('/:id')
    .get(compagnieController.getAllCompanies);

module.exports = router;
