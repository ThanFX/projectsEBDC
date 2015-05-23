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

        var query = 'key=BIZACCOUNT-4217';
        var optional = {
            startAt: 0,
                maxResults: 3
        };

        var options = {
            url: 'https://jira.2gis.ru/rest/api/2/issue/365826', //URL to hit
            //jql: 'key=BIZACCOUNT-4217', //Query string data
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Basic " + new Buffer(user.jira.login + ":" + user.jira.pass).toString('base64')
            }
        };

        console.log(options);

        request(options, function(err, res, body){
            if(err){
                console.log(err);
                return -1;
            }
            console.log(res.statusCode + ": " + body);
        });

/*        var jira = new JiraApi('https', 'jira.2gis.ru', '', 'm.zakharov', 'LetsGoToTheFishing!', '2');
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
                console.log(issue.issues);
                var issueQuery = issue.issues[0].id + "?expand=changelog";
                jira.findIssue(issueQuery, function(error, issue) {
                    if(error){
                        console.log(error);
                    } else {
                        console.log(issue.changelog.histories[0]);
                    }
                });
            }
        });*/
    }
});

