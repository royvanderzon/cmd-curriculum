var express = require('express');
var app = express();
var mysql = require('mysql');
var myConnection = require('express-myconnection');
var passport = require('passport');
var bcrypt = require('bcrypt-nodejs');
var flash = require('connect-flash');
var path = require('path');
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
var moment = require('moment');
var _ = require('underscore')._;

// MYSQL connection
var db_settings = {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: process.env.MYSQL_PORT
}

var connection = {
    query : function(p1,p2,p3){
        if(arguments.length == 2){
            return mysql.createConnection(db_settings).query(p1,p2)
        }else if(arguments.length == 3){
            return mysql.createConnection(db_settings).query(p1,p2,p3)
        }
    }
}

// var test = new Promise(
//     function(resolve, reject) {
//         if (true) {
//             setTimeout(function() {
//                 resolve('phone'); // fulfilled
//             }, 1000)
//         } else {
//             reject(reason); // reject
//         }
//     }
// );

// test.then() // chain it here
//     .then(function(ding) {
//         console.log(ding)
//     })

var site = {
	query : {
		build : {
			categories : function(idArray){
				
			}
		}
	},
    db: {
        //promise
        getCategory: function(id, cb) {
            var queryPromise = new Promise(
                function(resolve, reject) {
                    if (true) {
                        connection.query('SELECT * FROM category', function(err,result) {
                            if (err) {
                                reject(err);
                                return;
                            } else {
                            	resolve(result);
                                return;
                            }
                        });
                    } else {
                        reject(reason); // reject
                    }
                }
            );
            return queryPromise

        },
        getCategoriesContent: function(idArray, cb) {
            //make function where idArray is set to addQuery --> WHERE AND .. WHERE AND .. etc.....
            var addQuery = ''
            idArray.forEach(function(value, index){
                if(index < 1){
                    addQuery += ' ID = ' + value.id
                }else{
                    addQuery += ' OR ID = ' + value.id
                }
            })
            console.log(addQuery)
            var queryPromise = new Promise(
                function(resolve, reject) {
                    if (true) {
                        connection.query('SELECT * FROM category WHERE' + addQuery, function(err,result) {
                            if (err) {
                                reject(err);
                                return;
                            } else {
                                resolve(result);
                                return;
                            }
                        });
                    } else {
                        reject(reason); // reject
                    }
                }
            );
            return queryPromise

        }
    }
}

module.exports = site;
