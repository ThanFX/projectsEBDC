var log = require('../libs/log')(module);
var mongoose = require('../libs/mongoose');
var Schema = mongoose.Schema;

var shema = new Schema({

});
/* Описание полей схемы
*
 * */
exports.Task = mongoose.model('Sprint', schema);