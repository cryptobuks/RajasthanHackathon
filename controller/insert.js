var mysql = require('mysql');
var express = require('express');
var router = express.Router();
var cors = require('cors');
var bodyParser = require('body-parser');
const crypto = require('crypto');
var ethUtils = require('ethereumjs-util');
const nodemailer = require('nodemailer');

var ERRORS = {
    invalidHex: "Invalid hex input"
}

var getRandomWallet = function() {
   
    return {  }
}
var transporter = nodemailer.createTransport("SMTP", {
    host: 'smtp.ipage.com',
    port: 587,
    secure: true,
    auth: {
        user: "dhananjay.patil@rapidqube.com",
        pass: "Rpqb@12345"
    }
});

router.use(bodyParser.urlencoded({
    extended: true
}));
router.use(bodyParser.json());

function BD() {
    var connection = mysql.createConnection({
        user: 'root',
        password: 'rpqb123',
        host: 'localhost',
        // port: 3306,
        database: 'cc'
    });
    return connection;
}

router.post("/user/create", function(req, res) {
    var objBD = BD();
    console.log(req.body.email)
    objBD.connect();
    var randbytes = crypto.randomBytes(32);
    var address = '0x' + ethUtils.privateToAddress(randbytes).toString('hex');

    // var requestid = crypto.createHash('sha256').update(random_no).digest('base64');

    var user = {
        bank:req.body.bank,
        bankcode:req.body.bankcode,
        email: req.body.email,
        password: req.body.password,
        pubkey:address, 
        privkey:randbytes.toString('hex')
    };
    
    //console.log(user.username)
    objBD.query('INSERT INTO user_detail SET ?', user, function(error) {
       
    });

    var userResults, publickey , privatekey;
    objBD.query('select * from user_detail WHERE email = ?', [req.body.email], function(error, results, fields) {
        userResults = JSON.parse(JSON.stringify(results));
        console.log(userResults)
        
        console.log("results: " + userResults[0].email);
        emailtosend = userResults[0].email;
        publickey =userResults[0].pubkey;
        privatekey=userResults[0].privkey;
        var mailOptions = {
            transport: transporter,
            from: '"Cheque Clearance Application"<dhananjay.patil@rapidqube.com>',
            to: emailtosend,
            subject: 'Your personal credentials',
            text: req.body.text,
            html: "Hello,<br> you are successfully registered with Cheque Clearance here is your public key and private key please do not share it Account Number:---->"+publickey+"<br>"+"private Access key:---->"+privatekey
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {}
        });

        return res.json({
            message: 'success',
            error: false
        });
});
})


router.post("/user/login", cors(), function(req, res) {
    var objBD = BD();
    objBD.connect()
    console.log(req.body);
    var email = req.body.email;
    var password = req.body.password;

    objBD.query('SELECT * FROM user_detail WHERE email = ?', [email], function(error, results, fields) {
        // console.log("results:" + JSON.stringify(results));
        //console.log("fields:" + fields);
        if (error) {
            // console.log("error ocurred",error);

            res.send({
                "code": 400,
                "failed": "error ocurred"
            })
        } else {
            // console.log('The solution is: ', results);
            var resultLength = JSON.parse(JSON.stringify(results));
            //console.log("Length: " + resultLength.length);
            if (resultLength.length > 0) {
                // console.log("Password: " + resultLength[0].password);
                // console.log("PasswordUI: " + password);
                if (resultLength[0].password === password) {
                    var token="";
                    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789rapidqubepvtltd";
                    
                    for (var i = 0; i < 10; i++)
                        token += possible.charAt(Math.floor(Math.random() * possible.length));
                    console.log(token);
                    res.send({
                        "code": 200,
                        "success": "login sucessfull",
                        "email":resultLength[0].email,
                        "Account_address":JSON.stringify(resultLength[0].pubkey),
                        "token":token
                    });
                } else {
                    res.send({
                        "code": 400,
                        "success": "Email and password does not match"
                    });
                }
            } else {
                res.send({
                    "code": 404,
                    "success": "Email does not exits"
                });
            }
        }
    });
});

router.get("/user/get", cors(), function(req, res) {
    var objBD = BD();
    objBD.connect();

    objBD.query('select * from user_detail ', function(error, vals, fields) {
        var temp = JSON.stringify(vals);

        var userdetail = JSON.parse(temp);
        return res.json({
            users: userdetail,
            error: false
        });
    });
});

module.exports = router;

