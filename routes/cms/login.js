var express = require('express');
var passport = require('passport');
var zoncms = require(appRoot+'/zoncms');
var router = express.Router();
require('../../config/cms_passport')(passport);

var csrf = require('csurf')
var csrfProtection = csrf({ cookie: true })

router.get('/',zoncms.user.isAlreadyLoggedIn, csrfProtection , function(req, res) {

    res.render('cms/pages/login',
    	{
    		csrfToken: req.csrfToken(),
    		toast: req.flash('toast'),
    		menu : zoncms.menu.cms(req,res),
            page : {
                global : zoncms.settings.options,
                title : false,
                under_title : 'Login'
            },
            password_forgotten : req.flash('password_forgotten')
    	}
    );

});

router.post('/', csrfProtection, passport.authenticate('local-login', {
    successRedirect : '/cms', // redirect to the secure profile section
    failureRedirect : '/cms/login', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
}));

module.exports = router;