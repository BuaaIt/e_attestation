const usersDB = {
    users: require('../model/users'),
    setUsers: function (data) { this.users = data }
}


const express = require('express');
const router = express.Router();
const registerController = require('../controllers/registerController');


router.post('/', registerController.register);

router.get('/', function(req,res,next){
    res.render('register',{layout:false});
});

module.exports = router;