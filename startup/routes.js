const express = require('express');
const genres = require('../routes/genres');
const movies = require('../routes/movies');
const rentals = require('../routes/rentals');
const customers = require('../routes/customers');
const registers = require('../routes/registers');
const auth = require('../routes/auth');
const error = require('../middleware/error');
const debug = require('debug')('app:startup');
const helmet = require('helmet');

module.exports = function(app) {
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

  // Error Handling
  app.use(error);
};
