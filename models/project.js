var log = require('../libs/log')(module);
var mongoose = require('../libs/mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    title: String,
    shortName: String,
    description: String,
    startDate: Date,
    sprintCount: Number,
    bufferCount: Number,
    daysInSprint: Number,
    jqlFilter: String,
    startTaskStatus: String,
    EndTaskStatus: String,
    storyPointHour: Number,
    update: {
        type: String,
        period: Number
    },
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

/* Описание полей схемы
*   Название проекта
*   Короткий стринговый код проекта
*   Описание проекта
*   Дата старта проекта
*   Планируемое количество спринтов в проекте
*   Планируемое количество спринтов на буфер проекта
*   Календарных дней в спринте
*   Строка запроса задач в JIRA - задачи из запроса будут участвовать в расчете
*   Название статуса, начиная с которого задача считаеся взятой в работу в проект
*   Название статуса, начиная с которого задача считается выполненной для проекта
*   Количество календарных часов в одном SP
*   Обновление данных:
*       Тип обновления (ручное автоматическое)
*       Период обновления (при автоматическом обновлении)
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