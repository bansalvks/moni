var express = require('express');
var router = express.Router();

var users = require(global.appPath + 'models/user.m.js');
var responser = require(global.appPath + 'helpers/responser.h.js');
var jwt = require(global.appPath + 'helpers/jwt.h.js');


router.post('/signin', function (req, res) {

    var { email, password } = req.body;

    new users().authenticate(email, password).then(
        function (result) {
            var token = jwt.getToken(result);

            var output = new responser(token, 'Valid user and token is created');
            return output.sendSuccess(res);
        },
        function (err) {
            var output = new responser(err, 'Invalid User');
            return output.sendError(res);
        }
    );


})

/// jwt cannot be signed out from server
// router.get('/signout', function (req, res) {
//     if (!req.cookies.token.email) {
//         var output = new responser(true, "User is not signed in");
//         return output.sendSuccess(res);
//     }
//     else {
//         /// destroy session
//         res.cookie('token', {}, {
//             expires: 0,
//             httpOnly: false
//         })

//         var output = new responser(true, "Signed out");
//         return output.sendSuccess(res);
//     }
// })

module.exports = router