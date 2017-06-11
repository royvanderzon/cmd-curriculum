var express = require('express');
var zoncms = require(appRoot+'/zoncms');
var router = express.Router();

router.get('/', function(req, res) {

    if(zoncms.settings.options.mode_documentation == 'false'){
            req.flash('toast','"This page is disabled.", 3000, "red"');
            res.redirect('/cms');
            return;
    }

    res.render('cms/pages/documentation',
    	{
    		toast: req.flash('toast'),
    		menu : zoncms.menu.cms(req,res),
    		page : {
                global : zoncms.settings.options,
                title : 'Documentation',
                under_title : 'First things first.'
            }
    	}
    );
    
});

module.exports = router;