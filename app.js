const Joi = require('joi');
const config = require('config');
const debug = require('debug')('app:startup');
const helmet = require('helmet');
const morgan = require('morgan');
const express = require('express');
const logger = require('./logger');
const auth = require('./authenticate');

const app = express();

app.set('view engine', 'pug');
app.set('views', './views'); // all templates should be in views in this case

// Config
// console.log(`Application Name: ${config.get('name')}`);
// console.log(`Mail Server: ${config.get('mail.host')}`);
// console.log(`Mail Password: ${config.get('mail.password')}`);

// Built In Express Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// 3rd Party Middleware
app.use(helmet());
if (app.get('env') === 'development') {
  app.use(morgan('tiny'));
  debug('Morgan Enabled...');
}

// Custom Middleware
app.use(logger);
app.use(auth);

const genres = [
  {
    id: 1,
    genre: 'Action'
  },
  {
    id: 2,
    genre: 'Drama'
  },
  {
    id: 3,
    genre: 'Comedy'
  }
];

app.get('/api/genres', (req, res) => {
  res.send(genres);
});

app.post('/api/genres', (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = {
    id: genres.length + 1,
    genre: req.body.genre
  };
  genres.push(genre);
  res.send(genre);
});

app.put('/api/genres/:id', (req, res) => {
  const genre = genres.find(g => g.id === parseInt(req.params.id));
  if (!genre) return res.status(404).send('This genre does not exist');
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  genre.genre = req.body.genre;
  res.send(genre);
});

app.delete('/api/genres/:id', (req, res) => {
  const genre = genres.find(g => g.id === parseInt(req.params.id));
  if (!genre) return res.status(404).send('This genre does not exist');
  const index = genres.indexOf(genre);
  genres.splice(index, 1);
  res.send(genre);
});

validateGenre = genre => {
  const schema = {
    genre: Joi.string()
      .min(4)
      .required()
  };
  return Joi.validate(genre, schema);
};

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}...`);
});
