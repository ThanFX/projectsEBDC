var crypto = require('crypto');
var async = require('async');
var path = require('path');
var http = require('http');
var util = require('util');
var log = require('../libs/log')(module);
var mongoose = require('../libs/mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    login: {
        type: String,
        unique: true,
        required: true
    },
    hashedPassword: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    },
    jira: {
        login: String,
        pass:  String,
        host:  String
    },
    role: String,
    created: {
        type: Date,
        default: Date.now
    },
    projects: [{
        projectName: String,
        accessType: String
    }]
});

schema.methods.encryptPassword = function(password) {
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
};

schema.virtual('password').set(function(password) {
    this.salt = Math.random() + '';
    this.hashedPassword = this.encryptPassword(password);
});

schema.virtual('password').get(function() {
    return this.hashedPassword;
});

schema.methods.checkPassword = function(password) {
    return this.encryptPassword(password) === this.password;
};

schema.statics.isUserCreated = function(login, callback) {
    this.findOne({login: login}, function(err, user){
        if(err){
            log.err("isUserCreated, " + " " + login + ": " + err);
            callback(err);
        }
        if(user){
            log.info("Пользователь " + login + " существует");
            callback(null, user);
        } else {
            log.info("Пользователя " + login + " не существует");
            callback(null, null);
        }
    });
};

schema.statics.authorize = function(username, password, callback){
    var User = this;
    async.waterfall([
        function(callback) {
            User.findOne({login: username}, callback);
        },
        function(user, callback){
            if(user){
                if(user.checkPassword(password)){
                    callback(null, user);
                } else {
                    callback(new AuthError("Invalid password"));
                }
            } else {
                callback(new AuthError("User not found"));
            }
        }
    ], callback);
};

schema.statics.createUser = function(login, password, callback) {
    var User = this;
    User.isUserCreated(login, function(err, user){
        if(err) {
            callback(err);
        }
        if(user){
            callback(new AuthError("User is already created"));
        } else {
            user = new User({login: login, password: password});
            user.save(function (err) {
                if (err) return callback(err);
                log.info("User " + user.login + ' create successful');
                callback(null, user);
            });
        }
    });
};

schema.statics.saveJIRAParams = function(login, jiraLogin, jiraPass, jiraHost, callback){
    var User = this;
    User.isUserCreated(login, function(err, user){
        if(err){
            callback(err);
        }
        if(user){
            user.jira.login = jiraLogin;
            user.jira.pass = jiraPass;
            user.jira.host = jiraHost;
            user.markModified('jira');
            user.save(function (err) {
                if (err) return callback(err);
                console.log("JIRA params for user " + user.login + ' save successful');
                callback(null, user);
            });
        } else {
            callback(new AuthError("User not found"));
        }
    });
};

schema.statics.saveProject = function(login, project, callback){
    var User = this;
    User.isUserCreated(login, function(err, user){
        if(err){
            callback(err);
        }
        if(user){
            var elem = -1;
            for(var i = 0; i < user.projects.length; i++){
                if(user.projects[i].projectName == project.projectName){
                    user.projects[i].accessType = project.accessType;
                    elem = i;
                    break;
                }
            }
            if(elem == -1){
                user.projects.push(project);
            }
            user.markModified('projects');
            user.save(function (err) {
                if (err) return callback(err);
                console.log("Projects for user " + user.login + ' save successful');
                callback(null, user);
            });
        }
    });
};

exports.User = mongoose.model('User', schema);

function AuthError(message) {
    Error.apply(this, arguments);
    Error.captureStackTrace(this, AuthError);
    this.message = message;
}

util.inherits(AuthError, Error);
AuthError.prototype.name = 'AuthError';
exports.AuthError = AuthError;