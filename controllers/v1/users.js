var express = require('express');
var router = express.Router();

// modles
var users = require(global.appPath + 'models/user.m.js');

// helpers
var responser = require(global.appPath + 'helpers/responser.h.js');

// middlerwares
var authMid = require(global.appPath + 'middlewares/auth.mid.js');

/// using middlewares
router.use(authMid);

router.post('/register', function (req, res) {
    var body = req.body;

    var newUser = new users();

    newUser.first_name = body.first_name;
    newUser.last_name = body.last_name;
    newUser.email = body.email;
    newUser.password = body.password;

    newUser.registrationValidation().then(
        function (result) {
            newUser.create().then(
                function (result) {
                    var output = new responser(
                        {
                            id: result.insertedId.toString()
                        },
                        "Record has been inserted"
                    );

                    return output.sendSuccess(res);
                },
                function (err) {
                    var output = new responser(err, "Record has not been inserted");
                    return output.sendError(res);
                }
            );
        },
        function (validationErrors) {
            var output = new responser(validationErrors, "Record has some invalid/missing outputs inputs");
            return output.sendError(res);
        }
    );
})

router.post('/changePassword', function (req, res) {

    var { email, oldPassword, newPassword } = req.body;

    new users().changePassword(email, oldPassword, newPassword).then(
        function (result) {
            var output = new responser(true, "Password has been changed");
            return output.sendSuccess(res);
        },
        function (err) {
            var output = new responser(err, "Unable to change password");
            return output.sendError(res);
        }
    );

})

module.exports = router