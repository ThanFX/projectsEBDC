var User = require('../models/user').User;
var JiraApi = require('jira').JiraApi;
var log = require('../libs/log')(module);
var request = require('request');

var login = "Than";


User.isUserCreated(login, function(err, user){
    if(err){
        log.err("При запросе пользователя " + login + " произошла ошибка: " + err);
    }
    if(!user) {
        log.warn("Пользователь " + login + " существует");
    } else if(!user.jira) {
        log.warn("У пользователя " + login + " не заданы настройки JIRA");
    } else {
        main_uri = 'https://' + user.jira.host + '/rest/api/latest/search?jql=issue=BIZACCOUNT-4121';
        var auth = 'Basic ' + new Buffer(user.jira.login + ':' + user.jira.pass).toString('base64');
        var options = {
            uri: main_uri,
            Authorize: auth,
            headers: {
                "Content-Type": "application/json"
            }
        };

        function callback(error, response, body) {
            if (!error && response.statusCode == 200) {
                var info = JSON.parse(body);
                console.log(info.issues);
                //console.log(info.forks_count + " Forks");
            } else {
                console.log(error + " :: " + response.statusCode);
            }

        }

        var t = request.get('https://' + user.jira.host + '/rest/api/latest/search?jql=issue=BIZACCOUNT-4121', callback).auth(user.jira.login, user.jira.pass, true);


// or
        /*request.get('http://some.server.com/', {
            'auth': {
                'user': 'username',
                'pass': 'password',
                'sendImmediately': false
            }
        });*/

/*

        //console.log(options);

        request(options, callback);*/

        /*        var jira = new JiraApi('https', user.jira.host, "", user.jira.login, user.jira.pass, 'latest');
                if(jira){
                    jira.searchJira("issue=BIZACCOUNT-4121", "", function(error, issue) {
                    //jira.listFields(function(error, issue) {
                        if(error){
                            console.log(error);
                        } else {
                            for (var i = 0; i <= issue.length; i++){
                                for (var key in issue[i]){
                                    //console.log(key + ": " + issue[i][key]);
                                }
                            }
                            console.log('Status: ' + issue);
                            for (var key in issue){
                                console.log(key + ": " + issue[key]);
                            }
                        }
                    });
                }*/
    }
});


//console.log(jira);



/*
jira.findIssue(issueNumber, function(error, issue) {
    console.log('Status: ' + issue.fields.status.name);
});
*/

