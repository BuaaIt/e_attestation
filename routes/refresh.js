const express = require('express');
const router = express.Router();
const refreshTokenController = require('../controllers/refreshTokenController');


router.get('/', function(req,res,next){
    res.render('refresh',{layout:false});
});
router.post('/', refreshTokenController.handleRefreshToken);

module.exports = router;