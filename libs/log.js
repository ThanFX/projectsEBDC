var winston = require('winston');
var ENV = process.env.NODE_ENV;

function getLogger(module) {
    //Выводим только файл и папку из полного пути
    var path = module.filename.split('\\').splice(-2).join('\\');

    return new winston.Logger({
        transports: [
            new winston.transports.Console({
                colorize: true,
                //level: ENV == 'development' ? 'debug' : 'error',
                level: 'debug',
                label: path,
                timestamp: true
            })
        ]
    });
}

module.exports = getLogger;