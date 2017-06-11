var zoncms = require('../zoncms');

// app/routes.js
module.exports = function(app, passport) {

    // signup
    app.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('auth/signup.ejs', { message: req.flash('signupMessage') });
    });

    // profile
    app.get('/profile', zoncms.user.isLoggedIn, function(req, res) {
        res.render('auth/profile.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });

    //logout
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

};