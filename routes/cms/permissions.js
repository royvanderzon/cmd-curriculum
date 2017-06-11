var express = require('express');
var zoncms = require(appRoot+'/zoncms');
var router = express.Router();

router.get('/',zoncms.user.isLoggedIn,zoncms.user.checkLevel([115]), function(req, res) {

    zoncms.db.permission(function(permission){
    	res.render('cms/pages/permission', {
    		toast: req.flash('toast'),
    		menu : zoncms.menu.cms(req,res),
            user : req.user,
            page : {
                global : zoncms.settings.options,
                title : false,
                under_title : 'permission',
                title_head : 'permission'
            },
            permission: permission
        });
    });

});

router.post('/edit_permission',zoncms.user.isLoggedIn,zoncms.user.checkLevel([116]), function(req, res) {

    var data = req.body;
    var obj = {
        id : data.permission_id,
        db : 'permission',
        update : {
            name : data.permission_name,
            level : data.permission_level
        } 
    }

    zoncms.db.set(obj,function(){
        req.flash('toast','"permission updated.", 3000, "green"');
        res.redirect('/cms/settings/permissions')
    })
});

router.post('/new_permission',zoncms.user.isLoggedIn,zoncms.user.checkLevel([116]), function(req, res) {

    var data = req.body;
    var obj = {
        db : 'permission',
        insert : {
            name : data.new_permission_name,
            level : data.new_permission_level
        }
    }

    zoncms.db.add(obj,function(){
        req.flash('toast','"permission added.", 3000, "green"');
        res.redirect('/cms/settings/permissions')
    })
});

router.post('/remove_permission',zoncms.user.isLoggedIn,zoncms.user.checkLevel([116]), function(req, res) {

    var data = req.body;
    var obj = {
        db : 'permission',
        id : data.remove_input_ID
    }

    zoncms.db.del(obj,function(){
        req.flash('toast','"permission deleted.", 3000, "green"');
        res.redirect('/cms/settings/permissions')
    })


});

module.exports = router;