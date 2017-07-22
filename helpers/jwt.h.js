var jwt = require('jsonwebtoken');
var config = require(global.appPath + 'config.js');
var log = global.log;


function gettoken(data) {
    return jwt.sig(data, config.jwtSecret, { expiresIn: 60 * 60 });
}

function getData(token) {
    try {
        return jwt.verify(token, config.jwtSecret);
    } catch (er) {
        log.error(er);
        return null;
    }
}

module.exports = {
    gettoken: gettoken,
    getData: getData
}