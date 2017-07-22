var bunyan = require('bunyan');
var log = bunyan.createLogger({
    name: "moni",
    streams: [
        {
            level: 'error',
            path: './logs/'
            + new Date().getFullYear()
            + '-' + new Date().getMonth()
            + ' ' + new Date().getDate()
            + '.json'
        }
    ]
});

module.exports = log;