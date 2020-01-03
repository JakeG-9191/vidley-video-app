const winston = require('winston');
require('winston-mongodb');
require('express-async-errors');

module.exports = function() {
  winston.exceptions.handle(
    new winston.transports.File({ filename: 'uncaughtExceptions.log' })
  );

  process.on('unhandledRejection', ex => {
    throw ex;
  });

  winston.createLogger({
    transports: [new winston.transports.File({ filename: 'logfile.log ' })]
  });

  //   winston.add(new winston.transports.MongoDB(options), {
  //     db: 'mongodb://localhost/vidley',
  //     level: 'info'
  //   });
};
