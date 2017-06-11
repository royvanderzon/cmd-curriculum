var express = require('express');
var passport = require('passport');
var moment = require('moment');
var zoncms = require(appRoot+'/zoncms');
var router = express.Router();
require('../../config/cms_passport')(passport);

var csrf = require('csurf')
var csrfProtection = csrf({ cookie: true })

router.get('/',zoncms.user.isAlreadyLoggedIn, csrfProtection , function(req, res) {

    res.render('cms/pages/forgot_password',
    	{
    		csrfToken: req.csrfToken(),
    		toast: req.flash('toast'),
    		menu : zoncms.menu.cms(req,res),
            page : {
                global : zoncms.settings.options,
                title : false,
                under_title : 'Forgot password'
            },
            reset : false
    	}
    );

});

router.get('/request/:key',zoncms.user.isAlreadyLoggedIn, csrfProtection , function(req, res) {



    zoncms.db.find_key(req.params.key,function(result){
        if(result.length < 1){
            req.flash('toast','"This is not a valid reset password request.", 3000, "red"');
            res.redirect('/cms/forgot_password');
            return;
        }else{
            //everything in miliseconds!
            var key_created_time = Number(req.params.key.split('-')[0]);
            var expire_time = Number(zoncms.settings.options.forget_password_expire);
            var now = Number(moment.now());
            var expire_after = key_created_time + expire_time;
            // console.log('//////////// after this expire')
            // console.log(moment(expire_after).format("YYYY-MM-DD HH:mm"));
            // console.log('//////////// time now')
            // console.log(moment(now).format("YYYY-MM-DD HH:mm"));

            if(now > expire_after){
                req.flash('toast','"This password request link time has expired.", 3000, "red"');
                res.redirect('/cms/forgot_password');
                return;
            }

            res.render('cms/pages/forgot_password',
                {
                    csrfToken: req.csrfToken(),
                    toast: req.flash('toast'),
                    menu : zoncms.menu.cms(req,res),
                    page : {
                        global : zoncms.settings.options,
                        title : false,
                        under_title : 'Reset password'
                    },
                    forgot_key : req.params.key,
                    reset : true
                }
            );
        }
    })
});

router.post('/reset',zoncms.user.isAlreadyLoggedIn, csrfProtection , function(req, res) {

    var data = req.body;
    zoncms.db.find_key(data.forgot_key,function(result){


        if(result.length > 0){

            //everything in miliseconds!
            var key_created_time = Number(result[0].forgot_key.split('-')[0]);
            var expire_time = Number(zoncms.settings.options.forget_password_expire);
            var now = Number(moment.now());
            var expire_after = key_created_time + expire_time;

            if(now > expire_after){
                req.flash('toast','"This password request link time has expired.", 3000, "red"');
                res.redirect('/cms/forgot_password');
                return;
            }
            
            if(data.forgot_key == result[0].forgot_key && data.email == result[0].email){


                var pas1 = req.body.password;
                var pas2 = req.body.re_password;

                if(pas1 != pas2){
                    req.flash('toast','"Passwords don\'t match.", 3000, "orange"');
                    res.redirect('/cms/forgot_password/request/'+data.forgot_key);
                    return;
                }

                var hashedpass = zoncms.user.generateHash(pas1);
                var obj = {
                    update : {
                        password : hashedpass,
                        forgot_key : 'false'
                    },
                    id : result[0].ID
                }

                zoncms.db.update_user(obj,function(){
                    req.flash('toast','"Password changed.", 3000, "green"');
                    res.redirect('/cms/login'); 
                })

            }else{
                req.flash('toast','"Some criteria filled in false.", 3000, "red"');
                res.redirect('/cms/forgot_password/request/'+data.forgot_key); 
            }

        }else{
            req.flash('toast','"Some criteria filled in false.", 3000, "red"');
            res.redirect('/cms/forgot_password/request/'+data.forgot_key);
        }

    });

});

router.post('/',zoncms.user.isAlreadyLoggedIn, csrfProtection , function(req, res) {

    // SELECT email FROM user WHERE email='milan@mivents.nl' OR username='milan@mivents.nl';

    var obj = {
     query : req.body.email
    }

    //find user by email or username
    zoncms.db.find_user_multi(obj,function(result){
        if(result.length < 1){
            req.flash('toast','"We can\'t find this email or username.", 3000, "red"');
            res.redirect('/cms/forgot_password');
        }
        
        var user = result[0];
        var update_obj = {
            update : {
                forgot_key : zoncms.general.random_key()
            },
            id : user.ID
        }

        //store random key in username
        zoncms.db.update_user(update_obj,function(){

            var mail_obj = {
                to : user.email,
                subject : zoncms.settings.options.application_name + '| You forgot your password.',
                text : req.headers.host + '/cms/forgot_password/request/' + update_obj.update.forgot_key,
                html : '<a href="'+ req.headers.host + '/cms/forgot_password/request/' + update_obj.update.forgot_key +' target="_blank">Click here to reset your password</a> ' + req.headers.host + '/cms/forgot_password/request/' + update_obj.update.forgot_key
            }

            //send mail with instructions
            zoncms.mail.send(mail_obj,function(){

                req.flash('toast','"We have send you a mail with instructions.", 3000, "blue"');
                res.redirect('/cms/login');

            })
        })

    })

});

module.exports = router;