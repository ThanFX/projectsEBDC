var User = require('../models/user').User;
var JiraApi = require('jira').JiraApi;
var log = require('../libs/log')(module);

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
        var jira = new JiraApi('https', user.jira.host, "", user.jira.login, user.jira.pass, '2');
        if(jira){
            //jira.searchJira("project='Личный кабинет компании' and issue='BIZACCOUNT-4121'", "", function(error, issue) {
            jira.listFields(function(error, issue) {
                if(error){
                    console.log(error);
                } else {
                    console.log('Status: ' + issue);
                }
            });
        }
    }
});


//console.log(jira);



/*
jira.findIssue(issueNumber, function(error, issue) {
    console.log('Status: ' + issue.fields.status.name);
});
*/

