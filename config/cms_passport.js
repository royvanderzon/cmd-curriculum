// config/passport.js

// load all the things we need
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs');
var zoncms = require('../zoncms');
var mysql = require('mysql');

// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.ID);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        // connection.query("select * from user where ID = "+id,function(err,rows){    
        zoncms.db.get_user(id, function(result) {
            var user_obj = result[0];

            zoncms.db.get_user_permissions(user_obj.role_ID, function(result) {
                user_obj.permission = result;
                done(false, user_obj);
            });
        })

    });


    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function(req, email, password, done) {

            if (zoncms.settings.options.mode_signup == 'false') {
                return done(null, false, req.flash('toast', '"This page is disabled.", 3000, "red"'));
            }

            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            zoncms.db.get_by_email(email,function(err,rows){

            // connection.query("SELECT * FROM user WHERE email = ?", [email], function(err, rows) {
                if (err)
                    return done(err);
                if (rows.length) {
                    return done(null, false, req.flash('toast', '"' + email + ' is already taken.", 3000, "red"'));
                } else {

                    // if there is no user with that email
                    // create the user
                    var newUserMysql = new Object();

                    newUserMysql.email = email;
                    newUserMysql.password = password; // use the generateHash function in our user model


                    var hashedpass = zoncms.user.generateHash(password);

                    zoncms.db.create_user(email,hashedpass,function(err,rows){
                    // connection.query("INSERT INTO user ( email, password, role_ID ) values (?,?,?)", [email, hashedpass, '1'], function(err, rows) {
                        if (err) {
                            console.log(err);
                        } else {
                            newUserMysql.ID = rows.insertId;

                        }
                        return done(null, newUserMysql);
                    });
                }
            })
            // });
        }));

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-login', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function(req, email, password, done) { // callback with email and password from our form

            // connection.query("SELECT * FROM user WHERE email = ?",[email],function(err,rows){
            // connection.query("SELECT * FROM user JOIN role ON user.role_ID = role.ID WHERE email = ?",[email],function(err,rows){
            // connection.query("SELECT user.ID, user.email, user.username, user.firstname, user.lastname, user.password, user.forgot_key FROM user WHERE email = ?", [email], function(err, rows) {
            zoncms.db.get_user_passport(email,function(err,rows){
                if (err)
                    return done(err);
                if (!rows.length) {
                    return done(null, false, req.flash('toast', '"Email not found.", 3000, "orange"')); // req.flash is the way to set flashdata using connect-flash
                }

                // if the user is found but the password is wrong
                // console.log(zoncms.user.validPassword(password,rows[0].password));
                if (!zoncms.user.validPassword(password, rows[0].password)) {
                    return done(null, false, req.flash('toast', '"Wrong password.", 3000, "red"')); // create the loginMessage and save it to session as flashdata
                }


                //check if forgot password
                if (rows[0].forgot_key == 'false') {

                    // all is well, return successful user
                    return done(null, rows[0], req.flash('toast', '"Welcome, ' + rows[0].firstname + ' ' + rows[0].lastname + '!", 3000, "blue"'));

                } else {
                    //reset forgot key to false (de-activate)
                    var update_obj = {
                        update: {
                            forgot_key: 'false'
                        },
                        id: rows[0].ID
                    }
                    zoncms.db.update_user(update_obj, function() {
                        return done(null, rows[0], req.flash('toast', '"Welcome back! Your forget link is disabled now.", 3000, "green"'));
                    })

                }



            });



        }));

};
