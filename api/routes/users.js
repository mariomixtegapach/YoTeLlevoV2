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

/*
router.post('/newPoint', function(req, res){
  console.log('ke onda ke petz');
  res.status(500).json({});
});*/

router.put('/', function(req, res){
	console.log(req.body, req.query, req.params)
	req.body.photoUri = '/imgs/default.png'
	userServices.InserUser(req.body).then(function(user){
		res.json({ error: false, user: user })
	}, function(err){
		console.log(err)
		res.status(500).json(err);
	})
});

router.get('/checkUsername/:username', function(req, res){
	var username = req.params.username;
	console.log(username)
	if(!username) return res.status(500).json({error: true, message:'Username invalido'});

	userServices.GetUserByUsername(username).then(function(usrs){
		if(usrs.result.length){
			res.json({ usernameValid: false });
		} else {
			res.json({ usernameValid: true });
		}
		
	}, function(err){
		console.log(err);
		res.status(500).json({ error : true, message: err.message});
	})

});

module.exports = router;
