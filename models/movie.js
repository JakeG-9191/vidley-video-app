// Title
// Genre - Genre is a sub document
// numberInStock
// dailyRentalRate

const Joi = require('joi');
const mongoose = require('mongoose');
const { genreSchema } = require('./genre');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 150
  },
  genre: {
    type: genreSchema,
    required: true
  },
  numberInStock: {
    type: Number,
    required: true
  },
  dailyRentalRate: {
    type: Number,
    required: true
  }
});

const Movie = mongoose.model('Movie', movieSchema);

function validateMovie(movie) {
  const schema = {
    title: Joi.string()
      .min(3)
      .max(150)
      .required(),
    numberInStock: Joi.number(),
    dailyRentalRate: Joi.number()
  };
  return Joi.validate(movie, schema);
}

module.exports.Movie = Movie;
module.exports.validate = validateMovie;
