var log = require('../libs/log')(module);
var mongoose = require('../libs/mongoose');
var async = require('async');
var Schema = mongoose.Schema;

var schema = new Schema({
    name: String,
    shortName: String,
    description: String,
    startDate: Date,
    status: String,
    sprintCount: Number,
    bufferCount: Number,
    daysInSprint: String,
    jqlFilter: String,
    startTaskStatus: String,
    EndTaskStatus: String,
    storyPointHour: Number,
    updatePeriod: Number,
    tasks: [{
        type: String,
        id: Schema.ObjectId,
        key: String,
        startSprint: Number,
        endSprint: Number,
        estimate: Number,
        name: String,
        description: String,
        isFreeze: Boolean
    }],
    created: {
        type: Date,
        default: Date.now
    }
});

schema.statics.isProjectCreated = function(key, callback){
    this.findOne({shortName: key}, function(err, project){
        if(err){
            log.err(isProjectCreated + " " + key + ": " + err);
            callback(err);
        }
        if(project){
            callback(null, project);
        } else {
            log.info("Проекта " + key + " не существует");
            callback(null, null);
        }
    });
};

schema.statics.getShortInfo = function(project, callback){
    var Project = this;
    Project.isProjectCreated(project.projectName, function(err, project){
        if(err) {
            callback(err);
        }
        if(project){
            var info = {
                name: project.name,
                shortName: project.shortName,
                startDate: project.startDate,
                status: project.status
            };
            callback(null, info);
        } else {
            callback(null, null);
        }
    });
};

schema.statics.getProjectsShortInfo = function(projects, callback){
    var Project = this;
    async.map(projects, Project.getShortInfo.bind(Project), function(err, shortInfo){
        if(err) {
            callback(err);
        }
        callback(null, shortInfo);
    });
};

schema.statics.createOrUpdateProject = function(project, callback){
    var Project = this;
    Project.isProjectCreated(project.shortName, function(err, findingProject){
        if(err){
            callback(err);
        }
        if(findingProject) {
            for(var key in project) {
                if (!project.hasOwnProperty(key)) continue;
                findingProject[key] = project[key];
            }
            findingProject.save(function(err){
                if(err){
                    return callback(err);
                }
                log.info("Проект " + project.shortName + " обновлен");
                callback(null, findingProject);
            });
        } else {
            project.status = 'new';
            var newProject = new Project(project);
            newProject.save(function(err){
                if(err){
                    return callback(err);
                }
                log.info("Проект " + project.shortName + " создан");
                callback(null, newProject);
            });
        }
    });
};

/* Описание полей схемы
*   Название проекта
*   Короткий стринговый код проекта
*   Описание проекта
*   Дата старта проекта
*   Статус проекта (активен/нет)
*   Планируемое количество спринтов в проекте
*   Планируемое количество спринтов на буфер проекта
*   Календарных дней в спринте
*   Строка запроса задач в JIRA - задачи из запроса будут участвовать в расчете
*   Название статуса, начиная с которого задача считаеся взятой в работу в проект
*   Название статуса, начиная с которого задача считается выполненной для проекта
*   Количество календарных часов в одном SP
*   Обновлять данные раз n минут (0 - не обновлять)
*   Массив задач:
*       Тип задачи (импортированная/созданная вручную)
*       ID задачи из коллекции задач
*       Ключ задачи (JIRA key: f.e. BIZACCOUNT-1414)
*       Номер спринта, в котором пришла задача
*       Номер спринта, в котором задачу сделали
*       Номер спринта, в котором задачу выполнили
*       Первоначальная оценка длительности задачи в SP
*       Название задачи
*       Описание задачи
*       Флаг разрешающий/запрещающий обновление таски в проекте
*   Дата создания проекта
* */

exports.Project = mongoose.model('Project', schema);