var express = require('express');
var zoncms = require(global.appRoot + '/zoncms');
var site = require(global.appRoot + '/zoncms/site.js');
// var zoncms = require('../../zoncms');
// console.log(global.appRoot)
var router = express.Router();

router.get('/', function(req, res) {

    var objYear = {
        search: '*',
        db: 'year',
        query: ''
    }

    var objType = {
        search: '*',
        db: 'type',
        query: ''
    }

    zoncms.db.getP(objYear).then(function(years) {
        zoncms.db.getP(objType).then(function(types) {
            res.render('site/pages/home', {
                years: years,
                settings: zoncms.settings,
                types: types,
                slider: []
            });
        })
    })

});

router.get('/slider', function(req, res) {

    var objYear = {
        search: '*',
        db: 'year',
        query: ''
    }

    var objSlider = {
        search: '*',
        db: 'slider',
        query: ''
    }

    var objType = {
        search: '*',
        db: 'type',
        query: ''
    }

    zoncms.db.getP(objYear).then(function(years) {
        zoncms.db.getP(objSlider).then(function(slider) {
            zoncms.db.getP(objType).then(function(types) {
                res.render('site/pages/home', {
                    years: years,
                    settings: zoncms.settings,
                    types: types,
                    slider: slider
                });
            })
        })
    })

});

module.exports = router;
