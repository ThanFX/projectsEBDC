var config = require('../config/index.js');

var mongoose = require('mongoose');

mongoose.connect(config.get('mongoose:uri'), config.get('mongoose:options'));

module.exports = mongoose;