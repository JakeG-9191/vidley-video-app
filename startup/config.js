const config = require('config');

module.exports = function() {
  if (!config.get('jwtPrivate')) {
    throw new Error('FATAL ERROR: jwtPrivate is not defined');
  }
};
