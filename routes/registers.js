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

  const register = new Register({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  });
  await register.save();
  res.send(register);
});

router.put('/:id', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const register = await Register.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
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

router.get('/:id', async (req, res) => {
  const register = await Register.findById(req.params.id);

  if (!register)
    return res
      .status(404)
      .send(
        'There is no valid registration for this id, cannot fulfill request'
      );

  res.send(register);
});

module.exports = router;
