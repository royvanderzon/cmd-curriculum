global.__base = __dirname + '/';
require('dotenv').config()

var express = require('express');
var app = express();

var mysql = require('mysql');
var myConnection = require('express-myconnection');
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

var cms_routes = require('./routes/cms/home');
var site_routes = require('./routes/site/home');

var upload = multer({ dest: 'public/uploads/' });
app.use(express.static('public'));

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: process.env.SESSION_SAVEUNINITIALIZED,
    key: process.env.SESSION_KEY,
    resave: process.env.SESSION_RESAVE,
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use('/', site_routes);
app.use('/cms', cms_routes);
app.use('*', function(req, res) {
    req.flash('toast', '"Page not found.", 10000, "red"');
    res.redirect('/cms')
})

require('./routes/auth.js')(app, passport);

app.use(function(err, req, res, next) {
    if (err.code !== 'EBADCSRFTOKEN') return next(err);
    res.status(403);
    res.send('Wrong token. If this happens a lot, please reset your browser cache!');
});

function test() {
    zoncms.db.get({
        search: '*',
        db: 'year'
        query: ' WHERE ID = 16'
    },function(result){
    	console.log(result)
    })
}

test()

zoncms.db.test_connection();
zoncms.init.start(app, process.env.PORT || 3000);