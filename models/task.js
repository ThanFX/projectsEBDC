var User = require('../models/user').User;
var JiraApi = require('jira').JiraApi;
var log = require('../libs/log')(module);
var mongoose = require('../libs/mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    taskId: Number,
    key: String,
    name: String,
    description: String,
    creationType: String,
    status: String,
    estimate: Number,
    changelog: [{
        status: String,
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
                maxResults: 1000
            };
            optional.fields = ["key", "status", "summary", "description", "created", "timeoriginalestimate"];
            jira.searchJira(jqlFilter, optional, function(err, tickets) {
                if(err){
                    callback(err);
                }
                var tasks = [];
                for(var i = 0; i < tickets.issues.length; i++){
                    var task = {
                        id:             tickets.issues[i].id,
                        key:            tickets.issues[i].key,
                        status:         tickets.issues[i].fields.status.name,
                        name:           tickets.issues[i].fields.summary,
                        description:    tickets.issues[i].fields.description,
                        created:        tickets.issues[i].fields.created,
                        estimate:       tickets.issues[i].fields.timeoriginalestimate
                    };
                    tasks.push(task);
                }
                callback(null, tasks);
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