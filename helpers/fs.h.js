var path = require('path')
var fs = require('fs');


function getDirectories(srcpath) {
    return fs.readdirSync(srcpath)
        .filter(file => fs.lstatSync(path.join(srcpath, file)).isDirectory())
}
function getFiles(srcpath) {
    return fs.readdirSync(srcpath)
        .filter(file => (fs.lstatSync(path.join(srcpath, file)).isDirectory() === false))
}

function getAllFiles(srcpath) {
    var dirs = getDirectories(srcpath);
    var files = getFiles(srcpath);

    var result = [];

    files.forEach(function (p) {
        result.push(path.normalize(srcpath + "/" + p))
    }, this);

    dirs.forEach(function (p) {
        var nestedFiles = getAllFiles(path.normalize(srcpath + "/" + p));
        result = result.concat(nestedFiles);
    }, this);
    return result;
}

module.exports = {
    getDirectories: getDirectories,
    getFiles: getFiles,
    getAllFiles: getAllFiles
}