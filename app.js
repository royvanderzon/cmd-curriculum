// server.js
global.__base = __dirname + '/';
require('dotenv').config()

// set up ======================================================================
// get all the tools we need
var express = require('express');
var app = express();

var mysql = require('mysql');
var myConnection = require('express-myconnection');
console.log(process.env.PORT)
var port = process.env.PORT || 3000; //8080
var passport = require('passport');
var flash = require('connect-flash');
var path = require('path');
var bcrypt = require('bcrypt-nodejs');

var zoncms = require('./zoncms');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var multer = require('multer');
var nodemailer = require('nodemailer');
var schedule = require('node-schedule');
var flash = require('connect-flash');
var file = require('file-system');
var fs = require('fs');
var csrf = require('csurf');
var moment = require('moment');

global.appRoot = path.resolve(__dirname);

// set router ================================================================
var cms_routes = require('./routes/cms/home');
var site_routes = require('./routes/site/home');

// Uploaden
var upload = multer({ dest: 'public/uploads/' });
// Puplic
app.use(express.static('public')); // to add CSS

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

// Ejs
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: process.env.SESSION_SAVEUNINITIALIZED,
    key: process.env.SESSION_KEY,
    resave: process.env.SESSION_RESAVE,
}));

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

app.use('/', site_routes);
app.use('/cms', cms_routes);

require('./routes/auth.js')(app, passport);

app.use(function(err, req, res, next) {
    if (err.code !== 'EBADCSRFTOKEN') return next(err);
    // handle CSRF token errors here 
    res.status(403);
    res.send('Wrong token. If this happens a lot, please reset your browser cache!');
});

// test db =====================================================================
zoncms.db.test_connection();
// launch ======================================================================
zoncms.init.start(app, port);

// https://stackoverflow.com/questions/28973453/mysql2error-incorrect-string-value-xe2-x80-xa8-x09
