var express = require('express');
var zoncms = require(appRoot+'/zoncms');
var router = express.Router();

var csrf = require('csurf')
var csrfProtection = csrf({ cookie: true })

router.get('/',zoncms.user.isLoggedIn,zoncms.user.checkLevel([10]), function(req, res) {

	res.render('cms/pages/profile', {
		toast: req.flash('toast'),
		menu : zoncms.menu.cms(req,res),
        user : req.user,
		page : {
            global : zoncms.settings.options,
            title : false,
            under_title : 'Welcome, ' + req.user.firstname + ' ' + req.user.lastname
        }
    });

});

router.get('/edit',zoncms.user.isLoggedIn,zoncms.user.checkLevel([11]), csrfProtection, function(req, res) {

    if(zoncms.settings.options.allow_profile_edit == 'false'){
        req.flash('toast','"This page is disabled.", 3000, "red"');
        res.redirect('/cms');
        return;
    }

    res.render('cms/pages/edit_profile', {
        csrfToken: req.csrfToken(),
        toast: req.flash('toast'),
        menu : zoncms.menu.cms(req,res),
        user : req.user,
        page : {
            global : zoncms.settings.options,
            title : false,
            under_title : 'Welcome, ' + req.user.firstname + ' ' + req.user.lastname
        }
    });

});

router.post('/edit',zoncms.user.isLoggedIn,zoncms.user.checkLevel([11]), csrfProtection, function(req, res) {

    if(zoncms.settings.options.allow_profile_edit == 'false'){
        req.flash('toast','"This page is disabled.", 3000, "red"');
        res.redirect('/cms');
        return;
    }

    var data = req.body;
    var obj = {
        update : {
            firstname : data.firstname,
            lastname : data.lastname,
            mobile : data.mobile
        },
        id : req.user.ID
    }

    zoncms.db.update_user(obj,function(result){
        console.log(result);
        res.redirect('/cms/profile');
    })

});

module.exports = router;