var express = require('express');
var passport = require('passport');
var zoncms = require(appRoot+'/zoncms');
var router = express.Router();
require('../../config/cms_passport')(passport);

var csrf = require('csurf')
var csrfProtection = csrf({ cookie: true })

router.get('/',zoncms.user.isAlreadyLoggedIn, csrfProtection , function(req, res) {

    if(zoncms.settings.options.mode_signup == 'false'){
            req.flash('toast','"This page is disabled.", 3000, "red"');
            res.redirect('/cms');
            return;
    }

    res.render('cms/pages/signup',
        {
            csrfToken: req.csrfToken(),
            toast: req.flash('toast'),
            menu : zoncms.menu.cms(req,res),
            page : {
                global : zoncms.settings.options,
                title : false,
                under_title : 'Signup'
            }
        }
    );

    router.post('/', passport.authenticate('local-signup', {
        successRedirect : '/cms/profile', // redirect to the secure profile section
        failureRedirect : '/cms/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

});

module.exports = router;