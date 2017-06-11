var express = require('express');
var zoncms = require(global.appRoot + '/zoncms');
var site = require(global.appRoot + '/zoncms/site.js');
// var zoncms = require('../../zoncms');
console.log(global.appRoot)
var router = express.Router();

var categories = [{
    id: 1,
    slug: 'examples'
}, {
    id: 11,
    slug: 'footer'
}];

// test.then() // chain it here
//     .then(function(ding) {
//         console.log(ding)
//     })

// site.db.getCategory().then(function(result){
// 	console.log(result)
// })

// query to get all content elements from db
// SELECT * FROM content WHERE category_ID = 1 OR category_ID = 11 ORDER BY category_ID;

router.get('/', function(req, res) {
    console.log(req.baseUrl);

    site.db.getCategoriesContent(categories).then(function(result) {
        console.log(result)
    })

    res.render('site/pages/home');
});

module.exports = router;
