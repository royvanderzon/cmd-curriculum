var express = require('express');
var zoncms = require(appRoot+'/zoncms');
var router = express.Router();

router.get('/',zoncms.user.isLoggedIn,zoncms.user.checkLevel([30]), function(req, res) {

    res.render('cms/pages/home', {
        toast: req.flash('toast'),
        menu : zoncms.menu.cms(req,res),
        user : req.user,
        page : {
            global : zoncms.settings.options,
            title : false,
            under_title : 'Page',
            title_head : 'content'
        }
    });


});

//##POST TO CHANGE SETTINGS (AJAX CALL FROM CLIENT)
router.post('/',zoncms.user.isLoggedIn,zoncms.user.checkLevel([31]), function(req, res) {
    res.send('edit');
});

module.exports = router;