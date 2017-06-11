var express = require('express');
var zoncms = require(appRoot + '/zoncms');
var router = express.Router();

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

    var data = req.body;
    var obj = {
        id: data.type_id,
        db: 'type',
        update: {
            title: data.type_name,
            color: (data.type_description).split('#')[1]
        }
    }

    zoncms.db.set(obj, function() {
        req.flash('toast', '"type updated.", 3000, "green"');
        res.redirect('/cms/curriculum/type')
    })

});

router.get('/remove_type/:id', zoncms.user.isLoggedIn, zoncms.user.checkLevel([21]), function(req, res) {

    console.log(req.body)

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

router.post('/new_year', zoncms.user.isLoggedIn, zoncms.user.checkLevel([51]), function(req, res) {

    var data = req.body;
    var active = 'false';
    if(data.year_active == 'on'){
        active = 'true';
    }

    var obj = {
        db: 'year',
        insert: {
            title: data.new_curriculum_name,
            description: data.textarea_content,
            active: active
        }
    }

    zoncms.db.add(obj, function() {
        req.flash('toast', '"Year added.", 3000, "green"');
        res.redirect('/cms/curriculum/years')
    })
});

router.post('/edit_year', zoncms.user.isLoggedIn, zoncms.user.checkLevel([51]), function(req, res) {

    var data = req.body;
    var active = 'false';
    if(data.edit_year_active == 'on'){
        active = 'true';
    }
    var obj = {
        id: data.year_id,
        db: 'year',
        update: {
            title: data.year_name,
            description: data.year_description,
            active: active
        }
    }

    zoncms.db.set(obj, function() {
        req.flash('toast', '"Year updated.", 3000, "green"');
        res.redirect('/cms/curriculum/years')
    })

});

router.get('/remove_year/:id', zoncms.user.isLoggedIn, zoncms.user.checkLevel([21]), function(req, res) {

    console.log(req.body)

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
        res.redirect('/cms/curriculum/overview/'+years[0].ID)
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
                        types : types,
                        currentYear : req.params.id
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
