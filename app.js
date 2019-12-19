const Joi = require('joi');
const config = require('config');
const debug = require('debug')('app:startup');
const helmet = require('helmet');
const morgan = require('morgan');
const express = require('express');
const logger = require('./middleware/logger');
const auth = require('./middleware/authenticate');
const genres = require('./routes/genres');
const home = require('./routes/home');

const app = express();

app.set('view engine', 'pug');
app.set('views', './views'); // all templates should be in views in this case

// Config
console.log(`Application Name: ${config.get('name')}`);
// console.log(`Mail Server: ${config.get('mail.host')}`);
// console.log(`Mail Password: ${config.get('mail.password')}`);

// Built In Express Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Router
app.use('/api/genres', genres);
app.use('/', home);

// 3rd Party Middleware
app.use(helmet());
if (app.get('env') === 'development') {
  app.use(morgan('tiny'));
  debug('Morgan Enabled...');
}

// Custom Middleware
app.use(logger);
app.use(auth);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}...`);
});
