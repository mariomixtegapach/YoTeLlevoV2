var express = require('express');
var router = express.Router();
var UserServices = require('../services_v2/Users');
var userServices = new UserServices();


/* GET users listing. */
router.get('/', function(req, res, next) {
  
	userServices.GetUsersByQuery('mario').then(function(users){
		res.json({ users: users});
	}, function(err){
		console.log(err)
		res.json({ users: false, err : err});
	})
  
});

router.put('/', function(req, res){
	userServices.InserUser(req.body).then(function(user){
		res.json({ error: false, user: user })
	}, function(err){
		console.log(err)
		res.json(err);
	})
})

module.exports = router;
