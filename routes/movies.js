const { Movie, validate } = require('../models/movie');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const movies = await Movie.find().sort('title');
  res.send(movies);
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let movie = new Movie({ name: req.body.name });
  movie = await movie.save();
  res.send(movie);
});

router.put('/:id', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const movie = await Movie.findByIdAndUpdate(
    req.params.id,
    { title: req.body.title },
    { genre: req.body.genre },
    { numberInStock: req.body.numberInStock },
    { dailyRentalRate: req.body.dailyRentalRate },
    {
      new: true
    }
  );

  if (!movie)
    return res
      .status(404)
      .send('This movie does not exist and cannot be edited');

  res.send(movie);
});

router.delete('/:id', async (req, res) => {
  const movie = await Movie.findByIdAndRemove(req.params.id);

  if (!movie)
    return res
      .status(404)
      .send('This movie does not exist and cannot be deleted');

  res.send(movie);
});

router.get('/:id', async (req, res) => {
  const movie = await Movie.findById(req.params.id);

  if (!movie) return res.status(404).send('This movie does not exist');

  res.send(movie);
});

module.exports = router;
