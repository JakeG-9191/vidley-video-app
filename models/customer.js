const Joi = require('joi');
const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  isGold: {
    type: Boolean,
    required: true,
    default: false
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50
  },
  phone: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 12
  }
});

const Customer = mongoose.model('Customer', customerSchema);

function validateCustomer(customer) {
  const schema = {
    isGold: Joi.boolean().required(),
    name: Joi.string()
      .min(2)
      .max(50)
      .required(),
    phone: Joi.string()
      .min(10)
      .max(12)
      .required()
  };
  return Joi.validate(customer, schema);
}

module.exports.Customer = Customer;
module.exports.validate = validateCustomer;
