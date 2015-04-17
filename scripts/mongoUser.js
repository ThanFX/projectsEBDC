var mongoose = require('../libs/mongoose');
var User = require('../models/user').User;

//User.createUser("Vasja", "test123");

var user = new User({
    login: "Tester",
    password: "test"
});

/*User.createUser("Tester", "test", function(err, user){
    if(err){
        console.log(err);
    } else {
        console.log(user)
    }
});*/

/*User.authorize("Tester", "test", function(err, user){
    if(err){
        console.log(err);
    } else {
        console.log(user)
    }
});*/

User.saveJIRAParams("Tester", "login", "pass2", "http://jira.com", function(err, user){
    if(err){
        console.log(err);
    } else {
        console.log(user)
    }
});