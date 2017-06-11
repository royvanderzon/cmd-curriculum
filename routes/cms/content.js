var express = require('express');
var zoncms = require(appRoot+'/zoncms');
var router = express.Router();

var cms_category = require('../../routes/cms/category');
var cms_page = require('../../routes/cms/page');

router.use('/category', cms_category);
router.use('/page', cms_page);

router.get('/',zoncms.user.isLoggedIn,zoncms.user.checkLevel([20]), function(req, res) {


    var obj_category = {
        search : '*',
        db : 'category',
        query : ''
    }

    zoncms.db.get(obj_category,function(category){

        var obj_content = {
            where : ' category.ID = ' + category[0].ID
        }

        if(!req.session.show_category){
            req.session.show_category = category[0].ID;
        }else{
            res.redirect('/cms/content/cat/'+req.session.show_category);
            return;
        }

        zoncms.db.get_content(obj_content,function(content){
            res.render('cms/pages/content', {
                toast: req.flash('toast'),
                menu : zoncms.menu.cms(req,res),
                user : req.user,
                page : {
                    global : zoncms.settings.options,
                    title : false,
                    under_title : 'Content',
                    title_head : 'content'
                },
                content : content,
                category : category,
                show_category : category[0].ID
            });
        })
    })


});

router.get('/cat/:id',zoncms.user.isLoggedIn,zoncms.user.checkLevel([20]), function(req, res) {

    req.session.show_category = req.params.id;

    var obj_category = {
        search : '*',
        db : 'category',
        query : ''
    }

    var obj_content = {
        where : ' category.ID = ' + req.params.id
    }

    zoncms.db.get(obj_category,function(category){
        zoncms.db.get_content(obj_content,function(content){
            res.render('cms/pages/content', {
                toast: req.flash('toast'),
                menu : zoncms.menu.cms(req,res),
                user : req.user,
                page : {
                    global : zoncms.settings.options,
                    title : false,
                    under_title : 'Content',
                    title_head : 'content'
                },
                content : content,
                category : category,
                show_category : req.params.id
            });
        })
    })


});

router.post('/edit_content',zoncms.user.isLoggedIn,zoncms.user.checkLevel([21]), function(req, res) {

    var data = req.body;
    var obj = {
        id : data.content_ID,
        db : 'content',
        update : {
            name : data.name_content,
            content : data.textarea_content,
            category_ID : data.content_category
        } 
    }

    zoncms.db.set(obj,function(){
        req.flash('toast','"Content updated.", 3000, "green"');
        res.redirect('/cms/content')
    })

});

router.post('/new_content',zoncms.user.isLoggedIn,zoncms.user.checkLevel([21]), function(req, res) {

    var data = req.body;
    var obj = {
        db : 'content',
        insert : {
            name : data.new_content_name,
            content : data.new_content_textarea,
            category_ID : data.new_content_category
        }
    }

    zoncms.db.add(obj,function(){
        req.flash('toast','"Content added.", 3000, "green"');
        res.redirect('/cms/content')
    })
});

router.post('/remove_content',zoncms.user.isLoggedIn,zoncms.user.checkLevel([21]), function(req, res) {

    var data = req.body;
    var obj = {
        db : 'content',
        id : data.remove_input_ID
    }

    zoncms.db.del(obj,function(){
        req.flash('toast','"Content deleted.", 3000, "green"');
        res.redirect('/cms/content')
    })

});

module.exports = router;