var express = require('express');
var zoncms = require(appRoot + '/zoncms');
var multer = require('multer');
var path = require('path');
var router = express.Router();

var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        console.log(file)
        callback(null, global.appRoot+'/public/uploads/slider');
    },
    filename: function (req, file, callback) {
        console.log('file')
        console.log(file)
        var tempType = String(file.mimetype).split("/");
        var newType = tempType[tempType.length-1];
        callback(null, file.fieldname + '-' + Date.now() + '.' + newType);
    }
})

var upload = multer({ storage : storage,limits:{ fileSize: 3145728 } });

//////////////////////////////////////////////////////////////////////////////////////////////////////////
// ##################################################/////////////////////////////////////////////////////
//  SLIDER
// ##################################################/////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////

router.get('/', zoncms.user.isLoggedIn, zoncms.user.checkLevel([50]), function(req, res) {

    var obj_type = {
        search: '*',
        db: 'slider',
        query: ''
    }

    zoncms.db.get(obj_type, function(slider) {
        res.render('cms/pages/slider', {
            toast: req.flash('toast'),
            menu: zoncms.menu.cms(req, res),
            user: req.user,
            page: {
                global: zoncms.settings.options,
                title: false,
                under_title: 'slider',
                title_head: 'slider'
            },
            slider: slider
        });
    });
});

router.post('/new', zoncms.user.isLoggedIn, zoncms.user.checkLevel([51]),upload.any(), function(req, res) {

    var data = req.body;
    var active = 'false';
    if(data.slider_active == 'on'){
        active = 'true';
    }

    var obj = {
        db: 'slider',
        insert: {
            title: data.new_slider_name,
            active: active,
            path: req.files[0].filename
        }
    }

    zoncms.db.add(obj, function() {
        req.flash('toast', '"Slide added.", 3000, "green"');
        res.redirect('/cms/slider')
    })
});

router.post('/edit', zoncms.user.isLoggedIn, zoncms.user.checkLevel([51]), function(req, res) {

    var data = req.body;
    var active = 'false';
    if(data.edit_slider_active == 'on'){
        active = 'true';
    }
    var obj = {
        id: data.slider_id,
        db: 'slider',
        update: {
            title: data.slider_name,
            active: active
        }
    }

    zoncms.db.set(obj, function() {
        req.flash('toast', '"Slide updated.", 3000, "green"');
        res.redirect('/cms/slider')
    })

});

router.get('/remove/:id', zoncms.user.isLoggedIn, zoncms.user.checkLevel([51]), function(req, res) {

    console.log(req.body)

    var data = req.body;
    var obj = {
        db: 'slider',
        id: req.params.id
    }

    zoncms.db.del(obj, function() {
        req.flash('toast', '"Deleted slide.", 3000, "green"');
        res.redirect('/cms/slider')
    })

});

module.exports = router;
