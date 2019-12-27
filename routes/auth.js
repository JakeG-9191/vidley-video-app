const _ = require('lodash');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Joi = require('Joi');
const { Register } = require('../models/register');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

// router.get('/', async (req, res) => {
//   const register = await Register.find().sort('name');
//   res.send(register);
// });

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let register = await Register.findOne({ email: req.body.email });
  if (!register) return res.status(400).send('Invalid email or password');

  const validPassword = await bcrypt.compare(
    req.body.password,
    register.password
  );
  if (!validPassword) return res.status(400).send('Invalid email or password');

  const token = jwt.sign({ _id: register._id }, 'jwtPrivate');
  res.send(token);
});

function validate(req) {
  const schema = {
    email: Joi.string()
      .min(6)
      .max(255)
      .required()
      .email(),
    password: Joi.string()
      .min(6)
      .max(1024)
  };
  return Joi.validate(req, schema);
}

module.exports = router;
