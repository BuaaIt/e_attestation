const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/', function (req,res,next){
    res.render('auth', {layout : false});
});

router.post('/' ,authController.auth);



module.exports = router;