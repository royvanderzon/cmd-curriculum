var express = require('express');
var zoncms = require(appRoot+'/zoncms');
var router = express.Router();

router.get('/',zoncms.user.isLoggedIn,zoncms.user.checkLevel([90]), function(req, res) {

    var tableTitles = [
        { title: "ID" },
        { title: "Email" },
        { title: "Role" },
        { title: "Username" },
        { title: "First Name" },
        { title: "Last Name" },
        { title: "Mobile" }
    ];

    zoncms.db.roles(function(roles){
	    zoncms.db.users(function(result){
		    res.render('cms/pages/users',
		    	{
		    		toast: req.flash('toast'),
		    		menu : zoncms.menu.cms(req,res),
		            page : {
		                global : zoncms.settings.options,
		                title : false,
		                under_title : 'Users'
		            },
		            users : result,
		            roles : roles,
		            tableSettings: {
		                titles: tableTitles
		            }
		    	}
		    );
	    })
    })

});

router.post('/edit_user',zoncms.user.isLoggedIn,zoncms.user.checkLevel([91]), function(req, res) {

	var obj = {
		update : {
			email : req.body.input_email.toLowerCase(),
			username : req.body.input_username.toLowerCase(),
			firstname : req.body.input_firstname.toLowerCase(),
			lastname : req.body.input_lastname.toLowerCase(),
			mobile : req.body.input_mobile.toLowerCase(),
			role_ID : req.body.input_name
		},
		id : req.body.input_ID
	}

	zoncms.db.update_user(obj,function(){
		req.flash('toast','"User updated.", 3000, "green"');
		res.redirect('/cms/users')
	})
});

router.post('/add_user',zoncms.user.isLoggedIn,zoncms.user.checkLevel([91]), function(req, res) {

	var obj = {
		query : {
			email : req.body.new_email.toLowerCase(),
			username : req.body.new_username.toLowerCase(),
			firstname : req.body.new_firstname.toLowerCase(),
			lastname : req.body.new_lastname.toLowerCase(),
			mobile : req.body.new_mobile.toLowerCase(),
			role_ID : req.body.new_name
		}
	}


	//check if email
	zoncms.db.find_user({by:'email',query:obj.query.email},function(result){
		if(result.length > 0){
			req.flash('toast','"Email: '+result[0].email+' already exists!", 10000, "orange"');
			res.redirect('/cms/users')
		}else{
			//check if username
			zoncms.db.find_user({by:'username',query:obj.query.username},function(result){
				if(result.length > 0){
					req.flash('toast','"Username: '+result[0].username+' already exists!", 10000, "orange"');
					res.redirect('/cms/users')
				}else{
					zoncms.db.add_user(obj,function(result){
						req.flash('toast','"User added, with ID = '+result.insertId+'", 10000, "green"');
						res.redirect('/cms/users')
					})
				}
			})
		}
	})

});

router.post('/remove_user',zoncms.user.isLoggedIn,zoncms.user.checkLevel([91]), function(req, res) {
	zoncms.db.remove_user(req.body.remove_input_ID,function(){
		req.flash('toast','"User deleted.", 3000, "green"');
		res.redirect('/cms/users')
	})
});

router.post('/resetpass_user',zoncms.user.isLoggedIn,zoncms.user.checkLevel([91]), function(req, res) {

	var pas1 = req.body.input_password;
	var pas2 = req.body.re_input_password;

	if(pas1 != pas2){
		req.flash('toast','"Passwords don\'t match.", 3000, "orange"');
		res.redirect('/cms/users');
		return;
	}

	var hashedpass = zoncms.user.generateHash(pas1);
	var obj = {
		update : {
			password : hashedpass
		},
		id : req.body.resetpass_input_ID
	}

	zoncms.db.update_user(obj,function(){
		req.flash('toast','"Password changed.", 3000, "green"');
		res.redirect('/cms/users')
	})
	
});

module.exports = router;