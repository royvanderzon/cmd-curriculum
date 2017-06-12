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


	// test.then() // chain it here
	//     .then(function(ding) {
	//         console.log(ding)
	//     })

	// site.db.getCategory().then(function(result){
	// 	console.log(result)
	// })



	// var test = new Promise(
	//     function(resolve, reject) {
	//         if (true) {
	//             setTimeout(function() {
	//                 resolve('phone'); // fulfilled
	//             }, 1000)
	//         } else {
	//             reject(reason); // reject
	//         }
	//     }
	// );

	// test.then() // chain it here
 //    .then(function(ding) {
 //        console.log(ding)
 //    })


    // var obj_type = {
	   //  search: '*',
	   //  db: 'type',
	   //  query: ''
    // }

 //    zoncms.db.get(obj_type, function(types) {
 //        res.render('cms/pages/curriculum_type', {
 //            toast: req.flash('toast'),
 //            menu: zoncms.menu.cms(req, res),
 //            user: req.user,
 //            page: {
 //                global: zoncms.settings.options,
 //                title: false,
 //                under_title: 'Years',
 //                title_head: 'years'
 //            },
 //            types: types
 //        });
 //    });	


    var objYear = {
	    search: '*',
	    db: 'year',
	    query: ''
    }
 	zoncms.db.getP(objYear).then(function(result){
 		console.log('///////////////////////////////////')
 		console.log(result)
 	})


    // console.log(req.baseUrl);

    site.db.getCategoriesContent(categories).then(function(result) {
        // console.log(result)
    })

    res.render('site/pages/home');
});

// router.get('/:jaar',function(req,res){
// 	res.render('site/pages/jaar')
// })

module.exports = router;
