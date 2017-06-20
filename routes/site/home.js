var express = require('express');
var zoncms = require(global.appRoot + '/zoncms');
var site = require(global.appRoot + '/zoncms/site.js');
// var zoncms = require('../../zoncms');
console.log(global.appRoot)
var router = express.Router();

router.get('/', function(req, res) {

    var objYear = {
	    search: '*',
	    db: 'year',
	    query: ''
    }

 	zoncms.db.getP(objYear).then(function(years){
	    res.render('site/pages/home',{
	    	years : years,
	    	settings : zoncms.settings
	    });
 	})

});

// router.get('/:jaar',function(req,res){
// 	res.render('site/pages/jaar')
// })

module.exports = router;
