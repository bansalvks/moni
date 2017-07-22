var responser = function (data_ = '', message_ = '', code_) {
    this.data = data_;
    this.message = message_;
    this.code = code_;
}

responser.prototype.sendSuccess = function (res) {
    res.status(this.code || 200).send(this);
}

responser.prototype.sendError = function (res) {
    res.status(this.code || 400).send(this);
}

module.exports = responser;