const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const express = require('express');
const app = express();

// Start Up
require('./startup/logging')();
require('./startup/config');
require('./startup/routes')(app);
require('./startup/db')();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}...`);
});
