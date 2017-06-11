var express = require('express');
var zoncms = require(appRoot+'/zoncms');
var router = express.Router();

var cms_roles = require('../../routes/cms/roles');
var cms_permissions = require('../../routes/cms/permissions');

router.use('/roles', cms_roles);
router.use('/permissions', cms_permissions);

router.get('/',zoncms.user.isLoggedIn,zoncms.user.checkLevel([120]), function(req, res) {

    zoncms.module.status_setting('all', function(result){
    	res.render('cms/pages/settings', {
    		toast: req.flash('toast'),
    		menu : zoncms.menu.cms(req,res),
            user : req.user,
            settings : result[0],
            page : {
                global : zoncms.settings.options,
                title : false,
                under_title : 'Settings',
                title_head : 'Settings'
            }
        });
    })


});

//##POST TO CHANGE SETTINGS (AJAX CALL FROM CLIENT)
router.post('/change_setting',zoncms.user.isLoggedIn,zoncms.user.checkLevel([121]), function(req, res) {

    var data = req.body;
    console.log(data)
    zoncms.module.status_setting(data.key,data.value);
    res.end('ok');
});

module.exports = router;