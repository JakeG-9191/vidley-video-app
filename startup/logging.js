const winston = require('winston');
// require('winston-mongodb');
require('express-async-errors');

module.exports = function() {
  const logFormat = winston.format.printf(function(info) {
    return `${date}-${info.level}: ${JSON.stringify(info.message, null, 4)}\n`;
  });

  winston.exceptions.handle(
    new winston.transports.Console({
      level: 'info',
      format: winston.format.combine(winston.format.colorize(), logFormat)
    }),
    new winston.transports.File({ filename: 'uncaughtExceptions.log' })
  );

  process.on('unhandledRejection', ex => {
    throw ex;
  });

  winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'user-service' },
    transports: [
      new winston.transports.File({ filename: 'error.log', level: 'error' }),
      new winston.transports.File({ filename: 'combined.log' })
      // new winston.transports.MongoDB({
      //   db: 'mongodb://localhost/vidleyApp',
      //   level: 'info'
      // })
    ]
  });
};
