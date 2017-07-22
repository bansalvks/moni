var express = require('express');
var router = express.Router();

var responser = require(global.appPath + 'helpers/responser.h.js');
var jwt = require(global.appPath + 'helpers/jwt.h.js');

router.use(function (req, res, next) {
    var errorRes = function () {
        var output = new responser();
        output.data = "unauthorized";
        output.code = 401;
        output.message = "unauthorized";
        return output.sendError(res);
    }

    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
        var data = jwt.getData(token);
        if (data === null)
            return errorRes();

        req.tokenData = data;
        next();
    }
    else
        errorRes();
})

module.exports = router