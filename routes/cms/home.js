var express = require('express');
var zoncms = require(appRoot+'/zoncms');
var router = express.Router();

//Direct to routes/cms/..
var cms_login = require('../../routes/cms/login');
var cms_signup = require('../../routes/cms/signup');
var cms_users = require('../../routes/cms/users');
var cms_content = require('../../routes/cms/content');
var cms_profile = require('../../routes/cms/profile');
var cms_settings = require('../../routes/cms/settings');
var cms_documentation = require('../../routes/cms/documentation');
var cms_forgot_password = require('../../routes/cms/forgot_password');
var cms_curriculum = require('../../routes/cms/curriculum');
var cms_storage = require('../../routes/cms/storage');

//All routes after www.domain.com/cms/..
router.use('/login', cms_login);
router.use('/signup', cms_signup);
router.use('/users', cms_users);
router.use('/content', cms_content);
router.use('/profile', cms_profile);
router.use('/settings', cms_settings);
router.use('/documentation', cms_documentation);
router.use('/forgot_password', cms_forgot_password);
router.use('/curriculum', cms_curriculum);
router.use('/storage', cms_storage);

router.get('/', function(req, res) {

    zoncms.db.get_content(false,function(content){

        console.log(content)
        
        res.render('cms/pages/home',
        	{
        		toast: req.flash('toast'),
        		menu : zoncms.menu.cms(req,res),
        		page : {
                    global : zoncms.settings.options,
                    title : 'ZONMEDIA CMS',
                    under_title : 'A simple node.js content management system.',
                    title_head : 'Home'
                },
                content : content[0]
        	}
        );

    })

    
});

router.get('/logout', function(req, res) {

    zoncms.user.logout(req,res);

});

module.exports = router;