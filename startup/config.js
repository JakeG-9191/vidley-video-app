const config = require('config');

module.exports = function() {
  if (!config.get('jwtPrivate')) {
    console.error('FATAL ERROR: jwtPrivate is not defined');
    process.exit(1);
  }
};
