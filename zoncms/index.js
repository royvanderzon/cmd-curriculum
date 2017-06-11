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

var menus = require('./components/menus');
var insert_menu = [];

// MYSQL connection
var db_settings = {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: process.env.MYSQL_PORT
}

var connection = mysql.createConnection(db_settings);

var zoncms = {

	////////////////////////////////////
    //SETTINGS
    settings : {
    	page : {
    		application_name : 'ZONMEDIA CMS'
    	},
    	options : {
    		// signup : 'true'
    	},
    	vars : {
    		settings_row_ID : 1
    	},
    	db_settings : db_settings,
		smtpConfig : {
		    host: process.env.MAIL_HOST,
		    port: process.env.MAIL_PORT,
		    secure: process.env.MAIL_SSL, // use SSL
		    auth: {
		        user: process.env.MAIL_USER,
		        pass: process.env.MAIL_PASSWORD
		    }
		}
    },

    ////////////////////////////////////
    //INIT zoncms
	init : {
		//start zoncms
		start : function(app, port){
			app.listen(port);
        	console.log('////////////////////////////////');
			console.log('ZONCMS started on port: ' + port);
			zoncms.init.build_options();
		},
		build_options : function(){

			connection.query('SELECT * FROM setting', function(err,result) {
				if (err) {
	                console.log(err);
	                return false;
	            } else {
	            	if(result.length > 0){
	            		zoncms.settings.options = result[0];
	            		zoncms.settings.vars.settings_row_ID = result[0].ID;
		            	console.log('db.setting    : found');
	            	}else{

	            		//db.setting default settings
						var obj = {
							mode_contruction : 'false', // 'false' | 'true'
							mode_signup : 'true', // 'false' | 'true' | 'invite'
							application_name : 'ZONMEDIA CMS', // 'string'
							application_href : '', // 'string'
							application_logo : '', // 'string'
							mode_documentation : 'true', // 'false' | 'true'
							forget_password_expire : String( 24 * 60 * 60 * 1000), //in miliseconds
							allow_profile_edit : 'true'
						}

						connection.query('INSERT INTO setting SET ?',[obj], function(err, result) {
							if (err) {
				                console.log(err);
				                return false;
				            } else {
				            	zoncms.settings.options = obj;
				            	zoncms.settings.vars.settings_row_ID = result.insertId;
				            	console.log('db.setting    : inited');
				            }
						});
	            	}
	            }
			});

			connection.query('SELECT * FROM role', function(err,result) {
				if (err) {
	                console.log(err);
	                return false;
	            } else {
	            	if(result.length > 0){
		            	console.log('db.role       : found');
	            	}
	            }
			});

			connection.query('SELECT * FROM permission', function(err,result) {
				if (err) {
	                console.log(err);
	                return false;
	            } else {
	            	if(result.length > 0){
		            	console.log('db.permission : found');
	            	}
	            }
			});

			connection.query("SELECT count(user.email) as 'count' FROM user", function(err,result) {
				if (err) {
	                console.log(err);
	                return false;
	            } else {
	            	if(result[0].count > 0){
		            	console.log('db.user       : found');
	            	}
	            }
			});

			setTimeout(function(){
            	console.log('////////////////////////////////');
			},100)

		}
	},

    ////////////////////////////////////
    //GENERAL zoncms
    general : {
    	random_key : function(){

	    	var key = moment.now() + '-' + ((Math.floor(Math.random()*100)) * moment.now()) + '-' + ((Math.floor(Math.random()*100)) * moment.now());
	    	return key;

	    }
    },

    mail : {
    	send : function(obj,cb){

    		// var obj = {
    		// 	to : 'royvanderzon@gmail.com'
    		// 	subject : 'Hello world!',
    		// 	text : 'Lorem ipsum',
    		// 	html : '<p>Lorem ipsum</p>'
    		// }

			// create reusable transporter object using the default SMTP transport
			var transporter = nodemailer.createTransport(zoncms.settings.smtpConfig);


			transporter.verify(function(error, success) {
			   if (error) {
			        console.log(error);
			   } else {
			        console.log('Server is ready to take our messages');
			   }
			});

			// setup e-mail data with unicode symbols
			var mailOptions = {
			    from: '"'+zoncms.settings.options.application_name+'" <'+zoncms.settings.smtpConfig.auth.user+'>', // sender address
			    to: obj.to, // list of receivers
			    subject: obj.subject, // Subject line
			    text: obj.text, // plaintext body
			    html: obj.html // html body
			};

			// send mail with defined transport object
			transporter.sendMail(mailOptions, function(error, info){
			    if(error){
			        return console.log(error);

			    }
			    console.log('Message sent: ' + info.response);
			    if(typeof cb === 'function'){
			    	cb();
			    }
			});



    	}
    },

    ////////////////////////////////////
    //DB zoncms
    db : {
    	//test connection with mysql db
	    test_connection: function() {
	        connection.query('SELECT 1 AS solution', function(err) {
	            if (err) {
	                console.log(err);
	                return false;
	            } else {
	            	console.log('////////////////////////////////');
	            	console.log('db connection succesfull');
	            	console.log('host          : ' + db_settings.host);
	            	console.log('database      : ' + db_settings.database);
	            	console.log('port          : ' + db_settings.port);
	                return true;
	            }
	        });
	    },
	    //retrieves all users
	    users : function(cb){
	    	// connection.query('SELECT * FROM user JOIN role ON user.role_ID = role.ID', function(err, result) {
	    	connection.query('SELECT user.ID, user.email, user.username, user.password, user.firstname, user.lastname, user.profilepicture, user.adress_number, user.adress_street, user.birthdate, user.city, user.country, user.mobile, user.zip, role.name FROM user JOIN role ON user.role_ID = role.ID', function(err, result) {
				if (err) {
	                console.log(err);
	                return false;
	            } else {
	            	if(typeof cb === 'function'){
	            		cb(result);
	            	}
	            }
			});
	    },
	    update_user : function(obj,cb){
	    	// var obj = {
	    	// 	update : {
	    	// 		firstname : 'John',
	    	// 		lastname : 'Doe'
	    	// 	},
	    	// 	id : 4
	    	// }
			connection.query('UPDATE user SET ? WHERE ID = ?',[obj.update,obj.id], function(err, result) {
				if (err) {
	                console.log(err);
	                return false;
	            } else {
	            	if(typeof cb === 'function'){
	            		cb(result);
	            	}
	            }
			});
	    },
	    remove_user : function(id,cb){
			connection.query('DELETE FROM user WHERE ID = ?',[id], function(err, result) {
				if (err) {
	                console.log(err);
	                return false;
	            } else {
	            	if(typeof cb === 'function'){
	            		cb(result);
	            	}
	            }
			});
	    },
	    add_user : function(obj,cb){

	    	connection.query('INSERT INTO user SET ?',[obj.query], function(err, result) {
				if (err) {
	                console.log(err);
	                return false;
	            } else {
	            	if(typeof cb === 'function'){
	            		cb(result);
	            	}
	            }
			});
	    },
	    get_user_permissions : function(role_ID,cb){

	    	connection.query('SELECT permission.name, permission.level FROM role_permission JOIN permission ON permission_ID = permission.ID WHERE role_ID = ?',[role_ID], function(err, result) {
				if (err) {
	                console.log(err);
	                return false;
	            } else {
	            	if(typeof cb === 'function'){
	            		cb(result);
	            	}
	            }
			});

	    },
	    permission : function(cb){

	    	connection.query('SELECT *, CONVERT(level,UNSIGNED INTEGER) as num FROM permission ORDER BY num', function(err, result) {
				if (err) {
	                console.log(err);
	                return false;
	            } else {
	            	if(typeof cb === 'function'){
	            		cb(result);
	            	}
	            }
			});

	    },
	    find_user : function(obj,cb){
	    	// var obj = {
	    	// 	by : 'string',
	    	// 	query : 'query',
	    	// 	select : '',
	    	// }

	    	if(obj.select !== 'string'){
	    		obj.select = '*'
	    	}

			connection.query('SELECT '+obj.select+' FROM user WHERE '+obj.by+' = ?',[obj.query], function(err, result) {
				if (err) {
	                console.log(err);
	                return false;
	            } else {
	            	if(typeof cb === 'function'){
	            		cb(result);
	            	}
	            }
			});
	    },
	    find_user_multi : function(obj,cb){
	    	// var obj = {
	    	// 	query : 'query'
	    	// }

			connection.query('SELECT * FROM user WHERE email = ? OR username = ?',[obj.query,obj.query], function(err, result) {
				if (err) {
	                console.log(err);
	                return false;
	            } else {
	            	if(typeof cb === 'function'){
	            		cb(result);
	            	}
	            }
			});
	    },
	    move_users_role : function(obj,cb){

	    	// var obj = {
	    	// 	update : {
	    	// 		role_ID : 4
	    	// 	},
	    	// 	role_ID : 3
	    	// }
			connection.query('UPDATE user SET ? WHERE role_ID = ?',[obj.update,obj.role_ID], function(err, result) {
				if (err) {
	                console.log(err);
	                return false;
	            } else {
	            	if(typeof cb === 'function'){
	            		cb(result);
	            	}
	            }
			});
	    },
	    find_key : function(key,cb){
			connection.query('SELECT user.ID, user.email, user.forgot_key FROM user WHERE forgot_key = ?',[key], function(err, result) {
				if (err) {
	                console.log(err);
	                return false;
	            } else {
	            	if(typeof cb === 'function'){
	            		cb(result);
	            	}
	            }
			});
	    },
	    //get all roles
	    roles : function(cb){
	    	connection.query('SELECT * FROM role ', function(err, result) {
				if (err) {
	                console.log(err);
	                return false;
	            } else {
	            	if(typeof cb === 'function'){
	            		cb(result);
	            	}
	            }
			});
	    },
	    roles_with_permissions : function(role_id,cb){
	    	connection.query("SELECT role_permission.role_ID as 'role_ID', role_permission.permission_ID as 'permission_ID', permission.name as 'permission_name' FROM role_permission JOIN permission ON role_permission.permission_ID = permission.ID WHERE role_permission.role_ID = ? ",[role_id], function(err, result) {
				if (err) {
	                console.log(err);
	                return false;
	            } else {
	            	if(typeof cb === 'function'){
	            		cb(result);
	            	}
	            }
			});
	    },
	    roles_active : function(cb){
	    	connection.query('SELECT user.role_ID, role.ID, role.name FROM user JOIN role ON user.role_ID = role.ID GROUP BY role_ID', function(err, result) {
				if (err) {
	                console.log(err);
	                return false;
	            } else {
	            	if(typeof cb === 'function'){
	            		cb(result);
	            	}
	            }
			});
	    },
	    role_in_use : function(role,cb){
	    	connection.query('SELECT user.role_ID, role.ID, role.name FROM user JOIN role ON user.role_ID = role.ID WHERE role.ID = ? GROUP BY role_ID',[role], function(err, result) {
				if (err) {
	                console.log(err);
	                return false;
	            } else {
	            	if(typeof cb === 'function'){
	            		cb(result);
	            	}
	            }
			});
	    },
	    remove_role_permissions : function(role_id,cb){
			connection.query('DELETE FROM role_permission WHERE role_ID = ?',[role_id], function(err, result) {
				if (err) {
	                console.log(err);
	                return false;
	            } else {
	            	if(typeof cb === 'function'){
	            		cb(result);
	            	}
	            }
			});
	    },
	    insert_role_permissions : function(obj,cb){

	    	var values = [];
	    	for(var i = 0;i<obj.permissions.length;i++){
	    		var array = [];
	    		array.push(String(obj.role_ID));
	    		array.push(String(obj.permissions[i].permission_ID))
	    		values.push(array);
	    	}

	    	connection.query('INSERT INTO role_permission (role_ID,permission_ID) VALUES ?',[values], function(err, result) {
				if (err) {
	                console.log(err);
	                return false;
	            } else {
	            	if(typeof cb === 'function'){
	            		cb(result);
	            	}
	            }
			});
	    },
	    get_content : function(obj,cb){

	    	// var obj = {
	    	// 	where : ''
	    	// }

	    	if(typeof obj === 'object'){
		    	if(typeof obj.where != 'string'){
		    		obj.where = '';
		    	}else{
		    		obj.where = ' WHERE ' + obj.where
		    	}
	    	}else{
	    		var obj = {
	    			where : ''
	    		}
	    	}

			connection.query("SELECT content.ID as 'content_ID', category.ID as 'category_ID', content.content, content.name as 'content_name', category.name as 'category_name' FROM content JOIN category ON content.category_ID = category.ID" + obj.where, function(err, result) {
				if (err) {
	                console.log(err);
	                return false;
	            } else {
	            	if(typeof cb === 'function'){
	            		cb(result);
	            	}
	            }
			});
	    },
	    category_in_use : function(category_ID,cb){
	    	connection.query("SELECT content.ID as 'content_ID', category.ID as 'category_ID', content.content, content.name as 'content_name', category.name as 'category_name' FROM category JOIN content ON content.category_ID = category.ID WHERE category.ID = ?",[category_ID], function(err, result) {
				if (err) {
	                console.log(err);
	                return false;
	            } else {
	            	if(typeof cb === 'function'){
	            		cb(result);
	            	}
	            }
			});
	    },
	    move_content_category : function(obj,cb){

	    	// var obj = {
	    	// 	update : {
	    	// 		role_ID : 4
	    	// 	},
	    	// 	role_ID : 3
	    	// }

			connection.query('UPDATE content SET ? WHERE category_ID = ?',[obj.update,obj.category_ID], function(err, result) {
				if (err) {
	                console.log(err);
	                return false;
	            } else {
	            	if(typeof cb === 'function'){
	            		cb(result);
	            	}
	            }
			});
	    },
	    get : function(obj,cb){

	    	// var obj = {
	    	// 	search : '*',
	    	// 	db : 'user'
	    	// 	query : ''
	    	// }

	    	if(typeof obj.query != 'string'){
	    		obj.query = '';
	    	}

			connection.query('SELECT '+obj.search+' FROM ' +obj.db+obj.query, function(err, result) {
				if (err) {
	                console.log(err);
	                return false;
	            } else {
	            	if(typeof cb === 'function'){
	            		cb(result);
	            	}
	            }
			});
	    },
	    set : function(obj,cb){

	    	// var obj = {
	    	// 	id : 4,
	    	// 	db : 'user'
	    	// 	update : {
	    	// 		firstname : 'test'
	    	// 	} 
	    	// }

	    	if(typeof obj.query != 'string'){
	    		obj.query = '';
	    	}

			connection.query('UPDATE '+obj.db+' SET ? WHERE ID = ?',[obj.update,obj.id], function(err, result) {
				if (err) {
	                console.log(err);
	                return false;
	            } else {
	            	if(typeof cb === 'function'){
	            		cb(result);
	            	}
	            }
			});
	    },
	    add : function(obj,cb){

	    	// var obj = {
	    	// 	db : 'role',
	    	// 	insert : {
	    	// 		name : 'user',
	    	// 		level : '10'
	    	// 	}
	    	// }

	    	connection.query('INSERT INTO '+obj.db+' SET ?',[obj.insert], function(err, result) {
				if (err) {
	                console.log(err);
	                return false;
	            } else {
	            	if(typeof cb === 'function'){
	            		cb(result);
	            	}
	            }
			});
	    },
	    del : function(obj,cb){
	    	// var obj = {
	    	// 	db : 'role',
	    	// 	id : 4
	    	// }
			connection.query('DELETE FROM '+obj.db+' WHERE ID = ?',[obj.id], function(err, result) {
				if (err) {
	                console.log(err);
	                return false;
	            } else {
	            	if(typeof cb === 'function'){
	            		cb(result);
	            	}
	            }
			});
	    },
	    update_setting : function(settings,cb){
			connection.query('UPDATE setting SET ? WHERE ID = ?',[settings,zoncms.settings.vars.settings_row_ID], function(err, result) {
				if (err) {
	                console.log(err);
	                return false;
	            } else {
	            	if(typeof cb === 'function'){
	            		cb(result);
	            	}
	            }
			});
	    }
    },

    ////////////////////////////////////
    //USER zoncms
    user : {
	    logout: function(req, res){
	    	req.logout();
	    	req.flash('toast','"Successfully logged out.", 3000, "green"');
	        res.redirect('/cms');
	        return;
	    },
	    //function to check if user is authenticated
		isLoggedIn: function(req, res, next){
			// if user is authenticated in the session, carry on 
		    if (req.isAuthenticated()){
		        return next();
		    }else{
			    // if they aren't redirect them to the home page
			    req.flash('toast','"Please login.", 3000, "red"');
			    res.redirect('/cms/login');
		    }
		},
		isAlreadyLoggedIn: function(req, res, next){
			// if user is authenticated no use to visit this page
		    if (req.isAuthenticated()){
		    	req.flash('toast','"You are already logged in.", 3000, "green"');
			    res.redirect('/cms');
		    }else{
			    // if they aren't, the may continu
		        return next();
		    }
		},
		checkLevel: function(page_permission) {
		 	return function(req, res, next) {

			    var user_permissions = req.user.permission;

			    for(var i = 0;i<user_permissions.length;i++){
			    	// console.log(user_permissions[i].level)
			    	if(Number(user_permissions[i].level) == Number(page_permission[0])){
				    	next();
				    	return;
			    	}
			   	}

		    	req.flash('toast','"You don\'t have the rights to perform this action.", 3000, "red"');
		    	// req.flash('toast','"You are not authorized to view this page.", 3000, "red"');
		    	res.redirect('/cms');

			}
		},
		generateHash: function(password_plain) {
			return bcrypt.hashSync(password_plain, bcrypt.genSaltSync(8), null);
		},
		validPassword: function(password_plain, password_hash) {
			if(bcrypt.compareSync(password_plain, password_hash)){
				return true;
			}else{
				return false;
			}
		}
    },

    module : {

    	//signup_modus - 'setting name' (all for all settings) - 'false | true | etc.'
    	status_setting : function(type,status){

    		//SET
    		// zoncms.module.status_setting('mode_documentation','true')
    		//GET
    		// zoncms.module.status_setting('mode_documentation', function(status){})
    		// zoncms.module.status_setting('all', function(result){})

    		if(typeof status === 'string'){
    			var settingObj = {};
    			settingObj[type] = status;
			    zoncms.db.update_setting(settingObj,function(result){
			        zoncms.settings.options[type] = status;
			    })
    		}else if(typeof status === 'function'){
	    		var obj = {
			        search : '*',
			        db : 'setting'
			    }
			    zoncms.db.get(obj,function(result){
			    	if(type == 'all'){
						status(result);			    		
			    	}else{
				        if(result[0][type] == 'false'){
							status(false);
				        }else{
							status(true);
				        }
			    	}
			    })
    		}
    	}
    },

    ////////////////////////////////////
    //MENU zoncms
    menu : {
		//function to create menu
		cms: function(req, res){

			// console.log(req.user);

			var thisUser = {
				level : 1
			}

			if(req.user){
				thisUser = req.user;
			}

			//reset previous menu
			for(var i = 0;i<insert_menu.length;i++){
				if(typeof insert_menu[i].menus === 'object'){
					insert_menu[i].menus.length = 0;
				}
			}
			insert_menu.length = 0;

			//add default menu	        
	        insert_menu = insert_menu.concat(menus.menu_default);

			//if user is not logged in
			if(!req.isAuthenticated()){

		        insert_menu = insert_menu.concat(menus.menu_login);

				//add signup
		        if(zoncms.settings.options.mode_signup == 'true'){
			        insert_menu = insert_menu.concat(menus.menu_signup);
		        }

			}else{

				//loop trough permissions
				for(var i = 0;i<thisUser.permission.length;i++){

					var this_permission = thisUser.permission[i].level;

					//build profile
					if(this_permission == 10 || this_permission == 11){

						//make profile head
						var obj = menus.head_menu_profile;

						if(this_permission == 10){
							obj.menus.push(menus.sub_menu_profile_view);
						}
						if(this_permission == 11){
							obj.menus.push(menus.sub_menu_profile_edit);
						}

						//add to return insert_menu
						if(!_.contains(insert_menu, obj)){
					    	insert_menu = insert_menu.concat([obj]);
						}

					}

					//build curriculum
					if(this_permission == 50){

						//make profile head
						var obj = menus.curriculum;

						obj.menus.push(menus.sub_menu_curriculum_years);
						obj.menus.push(menus.sub_menu_curriculum_view);
						obj.menus.push(menus.sub_menu_curriculum_type);

						//add to return insert_menu
						if(!_.contains(insert_menu, menus.curriculum)){
							insert_menu = insert_menu.concat([obj]);
						}

					}

					//build profile
					if(this_permission == 90){

						//add users menu
				    	insert_menu = insert_menu.concat([menus.menu_users]);

					}

					//build content
					if(this_permission == 20 || this_permission == 30 || this_permission == 40){

						//make profile head
						var obj = menus.head_menu_content;

						if(this_permission == 20){
							obj.menus.push(menus.sub_menu_content_view);
						}
						// if(this_permission == 30){
						// 	obj.menus.push(menus.sub_menu_page_view);
						// }
						if(this_permission == 40){
							obj.menus.push(menus.sub_menu_category_view);
						}

						//add to return insert_menu
						if(!_.contains(insert_menu, obj)){
					    	insert_menu = insert_menu.concat([obj]);
						}

					}

					//build settings
					if(this_permission == 110 || this_permission == 115 || this_permission == 120){

						//make profile head
						var obj = menus.head_menu_admin;

						if(this_permission == 110){
							obj.menus.push(menus.sub_menu_admin_roles);
						}
						if(this_permission == 115){
							obj.menus.push(menus.sub_menu_admin_permissions);
						}
						if(this_permission == 120){
							obj.menus.push(menus.sub_menu_admin_general);
						}

						//add to return insert_menu
						if(!_.contains(insert_menu, obj)){
					    	insert_menu = insert_menu.concat([obj]);
						}

					}
				}

				//add logout
		        insert_menu = insert_menu.concat(menus.logout);

			}


			//add documentation
	        if(zoncms.settings.options.mode_documentation == 'true'){
		        insert_menu = insert_menu.concat(menus.menu_documentation);
	        }

			var hrefs = req.originalUrl.split('/');
			hrefs[0] = '/';

			// for(var i = 0;i<insert_menu.length;i++){
			// 	var this_active_found = false;
			// 	if(insert_menu[i].type == 'sub'){
					
			// 		for(var ii = 0;ii<insert_menu[i].menus.length;ii++){
			// 			// console.log(insert_menu[i].menus[ii].href)
			// 			if(insert_menu[i].menus[ii].href == req.baseUrl){
			// 				// console.log('MATCH')
			// 				if(!this_active_found){
			// 					insert_menu[i].class = ' active';
			// 					this_active_found = true;
			// 				}
			// 			}
			// 		}

			// 	}
			// 	if(insert_menu[i].href == req.baseUrl){
			// 		if(!this_active_found){
			// 			insert_menu[i].class = ' active';
			// 			this_active_found = true;
			// 		}
			// 	}else{
			// 		if(!this_active_found){
			// 			insert_menu[i].class = '';
			// 			this_active_found = true;
			// 		}
			// 	}
			// }
			return insert_menu;
			// return JSON.parse(JSON.stringify(insert_menu));
		}
    }

}

module.exports = zoncms;