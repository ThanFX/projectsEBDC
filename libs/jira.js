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
        var jira = new JiraApi('https', user.jira.host, "", user.jira.login, user.jira.pass, 'latest');
        var jql = "key=BIZACCOUNT-4217";
        //jql += "?expand=changelog";
        var optional = {
            startAt: 0,
            maxResults: 3
        };
        optional.fields = ["key", "status", "summary", "description", "created"];
        jira.searchJira(jql, optional, function(error, issue) {
            if(error){
                console.log(error);
            } else {
                console.log(issue.issues[0]);
                var issueQuery = issue.issues[0].id + "?expand=changelog";
                jira.findIssue(issueQuery, function(error, issue) {
                    if(error){
                        console.log(error);
                    } else {
                        console.log(issue.changelog.histories[0]);
                    }
                });
            }
        });
    }
});

