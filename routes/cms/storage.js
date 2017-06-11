var express = require('express');
var zoncms = require(appRoot+'/zoncms');
var multer = require('multer');
var path = require('path');
var router = express.Router();


var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        console.log(file)
        callback(null, global.appRoot+'/public/uploads/simple');
    },
    filename: function (req, file, callback) {
        console.log('file')
        console.log(file)
        var tempType = String(file.mimetype).split("/");
        var newType = tempType[tempType.length-1];
        callback(null, file.fieldname + '-' + Date.now() + '.' + newType);
    }
})

// var upload = multer({ storage : storage,limits:{ fileSize: 3145728 } }).array('upl',1);
var upload = multer({ storage : storage,limits:{ fileSize: 3145728 } });

router.post('/upload_simple',zoncms.user.isLoggedIn,zoncms.user.checkLevel([20]),upload.any(), function(req, res) {

    var obj = {
        link : '/uploads/simple/'+req.files[0].filename,
        status : 200,
        success : true
    }

    res.send(JSON.stringify(obj))
})

module.exports = router;