var express = require('express');
var router = express.Router();
var RoutesServices = require('../services_v2/Routes');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Express' });
});

router.get('/routes', function(req, res){

	var r = new RoutesServices();

	res.json({popo:'pipi'});
});

module.exports = router;
