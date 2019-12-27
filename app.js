const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const config = require('config');
const debug = require('debug')('app:startup');
const helmet = require('helmet');
const morgan = require('morgan');
const express = require('express');
const genres = require('./routes/genres');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const customers = require('./routes/customers');
const registers = require('./routes/registers');
const auth = require('./routes/auth');
const home = require('./routes/home');
const mongoose = require('mongoose');

mongoose
  .connect('mongodb://localhost/vidleyApp')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

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
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', registers);
app.use('/api/auth', auth);
app.use('/', home);

// 3rd Party Middleware
app.use(helmet());
if (app.get('env') === 'development') {
  app.use(morgan('tiny'));
  debug('Morgan Enabled...');
}
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}...`);
});
