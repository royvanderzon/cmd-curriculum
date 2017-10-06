var express = require('express');
var multer = require('multer');
var path = require('path');
var zoncms = require(appRoot + '/zoncms');
var router = express.Router();

var storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, global.appRoot + '/public/uploads/curriculum');
    },
    filename: function(req, file, callback) {
        var tempType = String(file.mimetype).split("/");
        var newType = tempType[tempType.length - 1];
        callback(null, file.fieldname + '-' + Date.now() + '.' + newType);
    }
})

var upload = multer({ storage: storage, limits: { fileSize: 3145728 } });

//////////////////////////////////////////////////////////////////////////////////////////////////////////
// ##################################################/////////////////////////////////////////////////////
//  TYPES
// ##################################################/////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////

router.get('/type', zoncms.user.isLoggedIn, zoncms.user.checkLevel([50]), function(req, res) {

    var obj_type = {
        search: '*',
        db: 'type',
        query: ''
    }

    zoncms.db.get(obj_type, function(types) {
        res.render('cms/pages/curriculum_type', {
            toast: req.flash('toast'),
            menu: zoncms.menu.cms(req, res),
            user: req.user,
            page: {
                global: zoncms.settings.options,
                title: false,
                under_title: 'Years',
                title_head: 'years'
            },
            types: types
        });
    });
});

router.post('/new_type', zoncms.user.isLoggedIn, zoncms.user.checkLevel([51]), function(req, res) {

    var data = req.body;
    var obj = {
        db: 'type',
        insert: {
            title: data.new_curriculum_name,
            color: (data.textarea_content).split('#')[1]
        }
    }

    zoncms.db.add(obj, function() {
        req.flash('toast', '"type added.", 3000, "green"');
        res.redirect('/cms/curriculum/type')
    })
});

router.post('/edit_type', zoncms.user.isLoggedIn, zoncms.user.checkLevel([51]), function(req, res) {

    var obj_year = {
        search: '*',
        db: 'year',
        query: ''
    }

    zoncms.db.get(obj_year, function(years) {
        var new_color = (data.type_description).split('#')[1];
        var old_color = (data.type_description_old).split('#')[1];
        years.forEach(function(year) {
            year.data = JSON.parse(year.data)
            year.data.rows.forEach(function(row) {
                row.forEach(function(column) {
                    column.column.forEach(function(item) {
                        if (item.color == old_color) {
                            item.color = new_color
                        }
                    })
                })
            })
            year.data = JSON.stringify(year.data)

            var update_year_obj = {
                id: year.ID,
                db: 'year',
                update: {
                    data: year.data
                }
            }
            zoncms.db.set(update_year_obj, function() {})

        })


    });

    var data = req.body;
    var obj = {
        id: data.type_id,
        db: 'type',
        update: {
            title: data.type_name,
            active: req.body.type_active,
            color: (data.type_description).split('#')[1]
        }
    }

    zoncms.db.set(obj, function() {
        req.flash('toast', '"type updated.", 3000, "green"');
        res.redirect('/cms/curriculum/type')
    })

});

router.get('/remove_type/:id', zoncms.user.isLoggedIn, zoncms.user.checkLevel([21]), function(req, res) {

    var data = req.body;
    var obj = {
        db: 'type',
        id: req.params.id
    }

    zoncms.db.del(obj, function() {
        req.flash('toast', '"type deleted.", 3000, "green"');
        res.redirect('/cms/curriculum/type')
    })

});

//////////////////////////////////////////////////////////////////////////////////////////////////////////
// ##################################################/////////////////////////////////////////////////////
//  YEARS
// ##################################################/////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////

router.get('/years', zoncms.user.isLoggedIn, zoncms.user.checkLevel([50]), function(req, res) {

    var obj_year = {
        search: '*',
        db: 'year',
        query: ''
    }

    zoncms.db.get(obj_year, function(year) {
        res.render('cms/pages/curriculum_years', {
            toast: req.flash('toast'),
            menu: zoncms.menu.cms(req, res),
            user: req.user,
            page: {
                global: zoncms.settings.options,
                title: false,
                under_title: 'Years',
                title_head: 'years'
            },
            year: year
        });
    });
});

router.post('/new_year', zoncms.user.isLoggedIn, zoncms.user.checkLevel([51]), upload.any(), function(req, res) {

    var data = req.body;
    var active = 'false';
    if (data.year_active == 'on') {
        active = 'true';
    }

    var obj = {
        db: 'year',
        insert: {
            title: data.new_curriculum_name,
            description: data.textarea_content,
            active: active,
            path: req.files[0].filename
        }
    }

    zoncms.db.add(obj, function() {
        req.flash('toast', '"Year added.", 3000, "green"');
        res.redirect('/cms/curriculum/years')
    })
});

router.post('/edit_year', zoncms.user.isLoggedIn, zoncms.user.checkLevel([51]), upload.any(), function(req, res) {

    var data = req.body;
    var active = 'false';
    if (data.edit_year_active == 'on') {
        active = 'true';
    }
    var updateObj = {}
    if (req.files.length > 0) {
        updateObj = {
            title: data.year_name,
            description: data.year_description,
            active: active,
            path: req.files[0].filename
        }
    } else {
        updateObj = {
            title: data.year_name,
            description: data.year_description,
            active: active
        }
    }
    var obj = {
        id: data.year_id,
        db: 'year',
        update: updateObj
    }

    zoncms.db.set(obj, function() {
        req.flash('toast', '"Year updated.", 3000, "green"');
        res.redirect('/cms/curriculum/years')
    })

});

router.get('/remove_year/:id', zoncms.user.isLoggedIn, zoncms.user.checkLevel([21]), function(req, res) {

    var data = req.body;
    var obj = {
        db: 'year',
        id: req.params.id
    }

    zoncms.db.del(obj, function() {
        req.flash('toast', '"Year deleted.", 3000, "green"');
        res.redirect('/cms/curriculum/years')
    })

});

//////////////////////////////////////////////////////////////////////////////////////////////////////////
// ##################################################/////////////////////////////////////////////////////
//  OVERVIEW
// ##################################################/////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////

router.get('/overview', zoncms.user.isLoggedIn, zoncms.user.checkLevel([50]), function(req, res) {

    var objYear = {
        search: '*',
        db: 'year',
        query: ''
    }

    zoncms.db.get(objYear, function(years) {
        res.redirect('/cms/curriculum/overview/' + years[0].ID)
    })

});

router.get('/overview/:id', zoncms.user.isLoggedIn, zoncms.user.checkLevel([50]), function(req, res) {

    var objYear = {
        search: '*',
        db: 'year',
        query: ''
    }

    var yearView = {
        search: '*',
        db: 'year',
        query: ' WHERE ID = ' + req.params.id
    }

    var objType = {
        search: '*',
        db: 'type',
        query: ''
    }

    zoncms.db.get(objYear, function(years) {
        zoncms.db.get(yearView, function(yearView) {
            zoncms.db.get(objType, function(types) {

                res.render('cms/pages/curriculum_overview', {
                    toast: req.flash('toast'),
                    menu: zoncms.menu.cms(req, res),
                    user: req.user,
                    page: {
                        global: zoncms.settings.options,
                        title: false,
                        under_title: 'Overview',
                        title_head: 'overview'
                    },
                    years: years,
                    yearView: yearView,
                    types: types,
                    currentYear: req.params.id
                });

            })
        })
    })

});

router.post('/save/:id', zoncms.user.isLoggedIn, zoncms.user.checkLevel([50]), function(req, res) {

    var data = req.body;
    var obj = {
        id: req.params.id,
        db: 'year',
        update: {
            data: JSON.stringify(req.body)
        }
    }

    zoncms.db.set(obj, function() {
        res.send('ok')
    })

});

module.exports = router;
