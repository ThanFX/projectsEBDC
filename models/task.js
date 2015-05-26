var User = require('../models/user').User;
var JiraApi = require('jira').JiraApi;
var log = require('../libs/log')(module);
var mongoose = require('../libs/mongoose');
var Schema = mongoose.Schema;
var async = require('async');

var schema = new Schema({
    taskId: Number,
    key: String,
    name: String,
    description: String,
    creationType: String,
    status: String,
    estimate: Number,
    changelog: [{
        statusFrom: String,
        statusTo: String,
        date: Date
    }],
    created: {
        type: Date,
        default: Date.now
    }
});

schema.statics.getUserJIRASettings = function(userName, callback){
    User.isUserCreated(userName, function(err, user){
        if(err){
            callback(err);
        }
        if(user){
            callback(null, user.jira);
        } else {
            callback(null, null);
        }
    });
};

schema.statics.getAllTasks = function(userName, jqlFilter, callback){
    this.getUserJIRASettings(userName, function(err, jiraSettings){
        if(err){
            callback(err);
        }
        if(jiraSettings){
            var jira = new JiraApi('https', jiraSettings.host, "", jiraSettings.login, jiraSettings.pass, 'latest');
            var optional = {
                startAt: 0,
                expand: "changelog",
                maxResults: 1
            };
            optional.fields = ["key", "status", "summary", "description", "created", "timeoriginalestimate"];
            optional.changelog = ["histories"];
            jira.searchJira(jqlFilter, optional, function(err, tickets) {
                if(err){
                    callback(err);
                }
                async.map(tickets.issues,
                    function(issue, issueCallback){
                        var statusHistory = [];
                        console.log(issue);
/*                        for (var i = 0; i < issue.changelog.histories.length; i++){
                            if(issue.changelog.histories[i].items[0].field != "status"){
                                continue;
                            }
                            var changeSatus = {
                                created: new Date(issue.changelog.histories[i].created),
                                statusFrom: issue.fields.histories[i].items[0].fromString,
                                statusTo: issue.fields.histories[i].items[0].toString
                            };
                            statusHistory.push(changeSatus);
                        }*/
                        var task = {
                            id:             issue.id,
                            key:            issue.key,
                            status:         issue.fields.status.name,
                            name:           issue.fields.summary,
                            description:    issue.fields.description,
                            created:        issue.fields.created,
                            estimate:       issue.fields.timeoriginalestimate,
                            changelog:      statusHistory
                        };
                        issueCallback(null, task);
                    },
                    function(err, tasks){
                        if(err){
                            callback(err, null);
                        }
                        callback(null, tasks);
                    }
                );
            });
        } else {
            callback(null, null);
        }
    });
};

/* Описание полей схемы
*   Идентификатор таски (жировский)
*   Ключ задачи (JIRA key: f.e. BIZACCOUNT-1414)
*   Название задачи
*   Описанаие задачи
*   Тип создания (импортированный/ручной)
*   текущий статус таски
*   Первоначальная оценка длительности задачи в секундах
*   История движения таски по статусной модели в жире
*       Статус таски
*       Дата перевода в этот статус
* */
exports.Task = mongoose.model('Task', schema);