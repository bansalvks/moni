global.appPath = __dirname + '/';
global.log = require(global.appPath + "managers/log.man.js");

var express = require('express');
var app = express();

var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')

app.use(bodyParser());
app.use(cookieParser());

app.use("/api", require('./controllers'))

app.listen(7777, function () {
    console.log('App is running on 7777...')
})