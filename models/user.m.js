var config = require(global.appPath + 'config.js');
var database = require(global.appPath + 'helpers/database.h.js')(config.dbUrl);
var ecryption = require(global.appPath + 'helpers/encryption.h.js');

var log = global.log;

var async = require("async");

var collectionName = 'users';

var user = function () {
  /// personal details
  this.first_name = '';
  this.last_name = '';
  this.email = '';
  this.password = '';

  /// payment details
  this.cca_working_key = '';
  this.cca_access_code = '';

  /// logs
  this.time_stamp = new Date();
}

user.prototype.create = function () {
  return new global.Promise((resolve, reject) => {
    var user = {
      "first_name": this.first_name,
      "last_name": this.last_name,
      "email": this.email,
      "password": ecryption.hash(this.password),
      "tine_stamp": this.tine_stamp
    }

    database.insert(collectionName, user).then(
      function (result) {
        return resolve(result);
      },
      function (err) {
        return reject(err);
      }
    );
  });
}

user.prototype.get = function (id) {
  return new global.Promise(function (resolve, reject) {
    database.fetch(collectionName, { _id: id }).then(
      function (result) {
        return resolve(result);
      },
      function (err) {
        return reject(err);
      }
    );
  });
}

user.prototype.getByEmail = function (email) {
  return new global.Promise((resolve, reject) => {
    database.fetch(collectionName,
      { email: email }).then(
      function (result) {
        return resolve(result);
      },
      function (err) {
        return reject(err);
      }
      );
  });
}

user.prototype.authenticate = function (email, password) {
  return new global.Promise((resolve, reject) => {
    database.fetch(collectionName, { email: email }).then(
      function (docs) {
        if (docs.length === 0) return reject("Invalid Email ID");

        var user = docs[0]
        if (user.password === ecryption.hash(password)) {

          delete result.cca_access_code;
          delete result.cca_working_key;
          delete result.password;

          return resolve(user);
        } else {
          return reject("password is not valid");
        }
      },
      function (err) {
        log.error(err, 'DB :: getByEmail :: fetch');
        return reject(err);
      }
    );
  });
}

user.prototype.changePassword = function (email, oldPassword, newPassword) {
  return new global.Promise(function (resolve, reject) {

    database.fetch(collectionName, { email: email }).then(
      function (docs) {
        if (docs.length === 0) return reject("Invalid Email ID");

        var user = docs[0]
        if (user.password === ecryption.hash(oldPassword)) {

          database.update(
            collectionName,
            { email: email },
            { password: ecryption.hash(newPassword) }
          ).then(
            function (data) {
              resolve("Password has been changed");
            },
            function (error) {
              return reject(err);
            });

        } else {
          return reject("password is not valid");
        }
      },
      function (err) {
        return reject(err);
      }
    );




  });
}

/// validations
user.prototype.registrationValidation = function () {
  return new global.Promise((resolve, reject) => {

    var syncValidations = (callback) => {
      var result = [];

      if (!this.first_name || this.first_name.length < 1) {
        result.push('First name not found')
      }

      if (!this.last_name || this.last_name.length < 1) {
        result.push('Last name not found')
      }

      if (!this.email || this.email.length < 1) {
        result.push('Email not found')
      }

      if (!this.password || this.password.length < 1) {
        result.push('Password not found')
      }

      if (!this.cca_working_key || this.cca_working_key.length < 1) {
        result.push('cca working key not found')
      }

      if (!this.cca_access_code || this.cca_access_code.length < 1) {
        result.push('cca access code not found')
      }

      if (result.length < 1)
        callback(null, result)
      else
        callback(result)
    }

    var emailIdExists = (callback) => {
      this.getByEmail(this.email).then(
        function (result) {

          if (result.length < 1)
            callback(null, result)
          else
            callback('Email id already exists.')
        },
        function (err) {
          callback(err)
        }
      );
    }

    async.parallel(
      {
        "feildValidations": syncValidations,
        "emailExists": emailIdExists
      },
      function (err, results) {
        if (err && err.length > 0) {
          return reject(err)
        }
        resolve(results);
      });
  });
}

module.exports = user;