var log = require('../libs/log')(module);
var mongoose = require('../libs/mongoose');
var Schema = mongoose.Schema;

var shema = new Schema({
    taskId: Number,
    key: String,
    name: String,
    description: String,
    creationType: String,
    curStatus: String,
    originalEstimate: Number,
    changelog: [{
        status: String,
        date: Date
    }],
    created: {
        type: Date,
        default: Date.now
    }

});
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