const auth = require('../middleware/auth');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');
const { Register, validate } = require('../models/register');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const register = await Register.find().sort('name');
  res.send(register);
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let register = await Register.findOne({ email: req.body.email });
  if (register) return res.status(400).send('This user has already registered');

  register = new Register(_.pick(req.body, ['name', 'email', 'password']));
  const salt = await bcrypt.genSalt(10);
  register.password = await bcrypt.hash(register.password, salt);

  await register.save();

  const token = register.generateAuthToken();
  res
    .header('x-auth-token', token)
    .send(_.pick(register, ['id', 'name', 'email']));
});

router.put('/:id', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const register = await Register.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      email: req.body.email
    },
    {
      new: true
    }
  );

  if (!register)
    return res
      .status(404)
      .send('This registration does not exist in the system, cannot update');

  res.send(register);
});

router.delete('/:id', async (req, res) => {
  const register = await Register.findByIdAndRemove(req.params.id);

  if (!register)
    return res
      .status(404)
      .send('There is no valid registration for this id, cannot delete');

  res.send(register);
});

router.get('/me', auth, async (req, res) => {
  const register = await Register.findById(req.register._id).select(
    '-password'
  );

  res.send(register);
});

module.exports = router;
