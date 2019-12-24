const Joi = require('joi');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

const customerSchema = new mongoose.Schema({
  isGold: {
    type: Boolean,
    required: true,
    default: false
  },
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  phone: {
    type: Number,
    required: true
  }
});

const Customer = mongoose.model('Customer', customerSchema);

router.get('/', async (req, res) => {
  const customer = await Customer.find().sort('name');
  res.send(customer);
});

router.post('/', async (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let customer = new Customer({
    isGold: req.body.isGold,
    name: req.body.name,
    phone: req.body.phone
  });
  customer = await customer.save();
  res.send(customer);
});

router.put('/:id', async (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    { isGold: req.body.isGold, name: req.body.name, phone: req.body.phone },
    {
      new: true
    }
  );

  if (!customer)
    return res
      .status(404)
      .send('This customer does not exist and cannot be edited');

  res.send(customer);
});

router.delete('/:id', async (req, res) => {
  const customer = await Customer.findByIdAndRemove(req.params.id);

  if (!customer)
    return res
      .status(404)
      .send('This customer does not exist and cannot be deleted');

  res.send(customer);
});

router.get('/:id', async (req, res) => {
  const customer = await Customer.findById(req.params.id);

  if (!customer)
    return res.status(404).send('This customer does not exist in the system');

  res.send(customer);
});

function validateGenre(customer) {
  const schema = {
    isGold: Joi.boolean().required(),
    name: Joi.string()
      .min(3)
      .required(),
    phone: Joi.number().required()
  };
  return Joi.validate(customer, schema);
}

module.exports = router;
