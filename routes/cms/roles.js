var express = require('express');
var zoncms = require(appRoot+'/zoncms');
var router = express.Router();

router.get('/',zoncms.user.isLoggedIn,zoncms.user.checkLevel([110]), function(req, res) {

    zoncms.db.roles(function(roles){
        zoncms.db.permission(function(permission){
        	res.render('cms/pages/roles', {
        		toast: req.flash('toast'),
        		menu : zoncms.menu.cms(req,res),
                user : req.user,
                page : {
                    global : zoncms.settings.options,
                    title : false,
                    under_title : 'Roles',
                    title_head : 'Roles'
                },
                roles: roles,
                permission : permission
            });
        });
    });

});

router.post('/edit_role',zoncms.user.isLoggedIn,zoncms.user.checkLevel([111]), function(req, res) {

    var data = req.body;
    var obj = {
        id : data.role_id,
        db : 'role',
        update : {
            name : data.role_name,
            level : data.role_level
        } 
    }

    zoncms.db.set(obj,function(){
        req.flash('toast','"Role updated.", 3000, "green"');
        res.redirect('/cms/settings/roles')
    })
});

router.post('/new_role',zoncms.user.isLoggedIn,zoncms.user.checkLevel([111]), function(req, res) {

    var data = req.body;
    var obj = {
        db : 'role',
        insert : {
            name : data.new_role_name,
            level : data.new_role_level
        }
    }

    zoncms.db.add(obj,function(){
        req.flash('toast','"Role added.", 3000, "green"');
        res.redirect('/cms/settings/roles')
    })
});

router.post('/remove_role',zoncms.user.isLoggedIn,zoncms.user.checkLevel([111]), function(req, res) {

    var data = req.body;
    var obj = {
        db : 'role',
        id : data.remove_input_ID
    }

    zoncms.db.role_in_use(obj.id,function(result){
        // console.log(result)
        if(result.length < 1){
            zoncms.db.del(obj,function(){
                req.flash('toast','"Role deleted.", 3000, "green"');
                res.send('ok');
            })
        }else{
            zoncms.db.roles(function(result){
                res.send(result)
            })
        }
    })

});

router.post('/get_permissions',zoncms.user.isLoggedIn,zoncms.user.checkLevel([111]), function(req, res) {

    var data = req.body;
    zoncms.db.roles_with_permissions(Number(data.role_ID),function(result){
        res.send(result);
    });

});

router.post('/edit_permission',zoncms.user.isLoggedIn,zoncms.user.checkLevel([111]), function(req, res) {

    var data = req.body;
    console.log(data);

    var insert_permissions = [];
    for(var i = 0;i<data.permissions.length;i++){
        var obj = {
            role_ID : data.role_ID,
            permission_ID : data.permissions[i].name
        }
        insert_permissions.push(obj);
    }

    var obj = {
        role_ID : data.role_ID,
        permissions : insert_permissions
    }


    console.log('insert_permissions');
    console.log(insert_permissions);

    zoncms.db.remove_role_permissions(data.role_ID,function(result){

        if(obj.permissions.length < 1){
            req.flash('toast','"Role permissions saved.", 3000, "green"');
            res.send('ok')
        }else{
            zoncms.db.insert_role_permissions(obj,function(result){
                req.flash('toast','"Role permissions saved.", 3000, "green"');
                res.send('ok')
            })
        }
    })


});


router.post('/move_role',zoncms.user.isLoggedIn,zoncms.user.checkLevel([111]), function(req, res) {

    var data = req.body;
    // console.log(data);

    var obj = {
        update : {
            role_ID : data.move_user_to
        },
        role_ID : data.move_remove_input_ID
    }

    zoncms.db.move_users_role(obj,function(){

        var remove_obj = {
            db : 'role',
            id : data.move_remove_input_ID
        }

        zoncms.db.del(remove_obj,function(){
            req.flash('toast','"Users moved.", 3000, "green"');
            res.redirect('/cms/settings/roles')
        })


    })

});


module.exports = router;