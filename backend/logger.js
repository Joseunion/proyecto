// logger.js
const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
      new winston.transports.File({
        filename: 'file.log',
      }),
    ],
});

module.exports = logger;
