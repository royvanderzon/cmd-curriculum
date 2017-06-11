var express = require('express');
var zoncms = require(appRoot+'/zoncms');
var router = express.Router();

router.get('/',zoncms.user.isLoggedIn,zoncms.user.checkLevel([40]), function(req, res) {

    var obj_category = {
        search : '*',
        db : 'category',
        query : ''
    }

    var obj_content = {
        search : 'ID, name, category_ID',
        db : 'content',
        query : ''
    }

    zoncms.db.get(obj_category,function(category){
        zoncms.db.get(obj_content,function(content){
            res.render('cms/pages/category', {
                toast: req.flash('toast'),
                menu : zoncms.menu.cms(req,res),
                user : req.user,
                page : {
                    global : zoncms.settings.options,
                    title : false,
                    under_title : 'Category',
                    title_head : 'content'
                },
                category : category,
                content : content
            });
        });
    })

});

router.post('/new_category',zoncms.user.isLoggedIn,zoncms.user.checkLevel([41]), function(req, res) {

    var data = req.body;
    var obj = {
        db : 'category',
        insert : {
            name : data.new_category_name,
            permission : data.new_category_permission
        }
    }

    zoncms.db.add(obj,function(){
        req.flash('toast','"Category added.", 3000, "green"');
        res.redirect('/cms/content/category')
    })
});

router.post('/edit_category',zoncms.user.isLoggedIn,zoncms.user.checkLevel([41]), function(req, res) {

    var data = req.body;
    var obj = {
        id : data.category_id,
        db : 'category',
        update : {
            name : data.category_name,
            permission : data.category_level
        } 
    }

    zoncms.db.set(obj,function(){
        req.flash('toast','"Category updated.", 3000, "green"');
        res.redirect('/cms/content/category')
    })
});

router.post('/remove_category',zoncms.user.isLoggedIn,zoncms.user.checkLevel([41]), function(req, res) {

    console.log('hoiii')

    var data = req.body;
    var obj = {
        db : 'category',
        id : data.remove_input_ID
    }


    zoncms.db.category_in_use(obj.id,function(result){
        // console.log(result)
        if(result.length < 1){
            zoncms.db.del(obj,function(){
                req.flash('toast','"Category deleted.", 3000, "green"');
                res.send('ok');
            })
        }else{
            var obj_category = {
                search : '*',
                db : 'category',
                query : ''
            }
            zoncms.db.get(obj_category,function(category){
                res.send(category)
            })
        }
    })

});

router.post('/move_category',zoncms.user.isLoggedIn,zoncms.user.checkLevel([41]), function(req, res) {

    var data = req.body;
    // console.log(data);

    var obj = {
        update : {
            category_ID : data.move_user_to
        },
        category_ID : data.move_remove_input_ID
    }

    zoncms.db.move_content_category(obj,function(){

        var remove_obj = {
            db : 'category',
            id : data.move_remove_input_ID
        }

        zoncms.db.del(remove_obj,function(){
            if(req.session.show_category){
                req.session.show_category = false;
            }
            req.flash('toast','"Users moved.", 3000, "green"');
            res.redirect('/cms/content/category')
        })


    })

});

module.exports = router;